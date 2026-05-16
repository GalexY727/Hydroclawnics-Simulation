from __future__ import annotations

import asyncio
import json
from pathlib import Path

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

import agent_bridge
import state
from simulator import SimulatorEngine, inject_fault

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIST = BASE_DIR / "frontend" / "dist"


class FaultRequest(BaseModel):
    fault: str


class ActionRequest(BaseModel):
    timestamp: str
    pod_id: str
    sensor_state: dict
    diagnosis: str
    action: str
    reasoning: str


app = FastAPI(title="Hydroclawnics")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = SimulatorEngine()
clients: set[WebSocket] = set()
bridge_task: asyncio.Task | None = None


async def broadcast(message: dict) -> None:
    if not clients:
        return
    stale: list[WebSocket] = []
    payload = json.dumps(message)
    for client in clients:
        try:
            await client.send_text(payload)
        except Exception:
            stale.append(client)
    for client in stale:
        clients.discard(client)


async def on_tick(pods_payload: list[dict]) -> None:
    await broadcast({"type": "pod_update", "pods": pods_payload})


@app.on_event("startup")
async def startup_event() -> None:
    global bridge_task
    engine.add_listener(on_tick)
    await engine.start()

    async def bridge_broadcast(entry: dict) -> None:
        state.append_decision(entry)
        await broadcast({"type": "agent_decision", "entry": entry})

    bridge_task = asyncio.create_task(agent_bridge.tail_decisions(bridge_broadcast), name="decision-tail")


@app.on_event("shutdown")
async def shutdown_event() -> None:
    if bridge_task:
        bridge_task.cancel()
    await engine.stop()


@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket) -> None:
    await ws.accept()
    clients.add(ws)
    try:
        await ws.send_json({"type": "pod_update", "pods": engine.snapshot()})
        while True:
            await ws.receive_text()
    except WebSocketDisconnect:
        clients.discard(ws)
    except Exception:
        clients.discard(ws)


@app.get("/api/pods")
async def get_pods() -> list[dict]:
    return engine.snapshot()


@app.get("/api/pods/{pod_id}")
async def get_pod(pod_id: str) -> dict:
    for pod in engine.snapshot():
        if pod["id"] == pod_id:
            return pod
    raise HTTPException(status_code=404, detail="Pod not found")


@app.post("/api/fault/{pod_id}")
async def post_fault(pod_id: str, body: FaultRequest) -> dict:
    for pod in engine.pods:
        if pod.id == pod_id:
            inject_fault(pod, body.fault)
            return {"ok": True, "pod": pod_id, "fault": body.fault}
    raise HTTPException(status_code=404, detail="Pod not found")


@app.post("/api/action")
async def post_action(body: ActionRequest) -> dict:
    entry = body.model_dump()
    state.append_decision(entry)
    agent_bridge.DECISIONS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with agent_bridge.DECISIONS_FILE.open("a", encoding="utf-8") as fp:
        fp.write(json.dumps(entry) + "\n")
    await broadcast({"type": "agent_decision", "entry": entry})
    return {"ok": True}


if FRONTEND_DIST.exists():
    app.mount("/", StaticFiles(directory=FRONTEND_DIST, html=True), name="frontend")


@app.get("/{full_path:path}")
async def spa_fallback(full_path: str) -> FileResponse:
    index_path = FRONTEND_DIST / "index.html"
    if index_path.exists():
        return FileResponse(index_path)
    raise HTTPException(status_code=404, detail="Frontend build not found")
