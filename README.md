# Hydroclawnics-Simulation

Hydroclawnics monorepo for a real-time hydroponics farm simulation and AI agent dashboard.

## Structure

```text
hydroclawnics/
├── main.py
├── simulator.py
├── state.py
├── agent_bridge.py
├── requirements.txt
├── memory/
│   └── decisions.jsonl
├── sensors/
│   └── pod_states.json
└── frontend/
```

## Backend (dev)

```bash
cd hydroclawnics
pip install -r requirements.txt
uvicorn main:app --reload
```

## Frontend (dev)

```bash
cd hydroclawnics/frontend
npm install
npm run dev
```

## Production build

```bash
cd hydroclawnics/frontend
npm run build
```

After building, FastAPI serves `frontend/dist/` automatically at `/`.
