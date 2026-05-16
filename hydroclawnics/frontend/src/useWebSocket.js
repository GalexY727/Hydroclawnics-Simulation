import { useEffect, useMemo, useRef, useState } from 'react'

const WS_RETRY_MS = 1500

export default function useWebSocket() {
  const [pods, setPods] = useState([])
  const [agentLog, setAgentLog] = useState([])
  const reconnectRef = useRef(null)
  const wsRef = useRef(null)

  const wsUrl = useMemo(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    return `${protocol}://${window.location.host}/ws`
  }, [])

  useEffect(() => {
    let mounted = true

    const connect = () => {
      if (!mounted) {
        return
      }
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          if (message.type === 'pod_update') {
            setPods(message.pods ?? [])
          }
          if (message.type === 'agent_decision' && message.entry) {
            setAgentLog((prev) => [message.entry, ...prev].slice(0, 300))
          }
        } catch {
          // ignore malformed payloads
        }
      }

      ws.onclose = () => {
        if (!mounted) {
          return
        }
        reconnectRef.current = setTimeout(connect, WS_RETRY_MS)
      }
    }

    connect()

    return () => {
      mounted = false
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current)
      }
      if (wsRef.current && wsRef.current.readyState < 2) {
        wsRef.current.close()
      }
    }
  }, [wsUrl])

  return { pods, agentLog }
}
