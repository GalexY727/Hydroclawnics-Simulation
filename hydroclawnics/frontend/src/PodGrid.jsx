import { useMemo, useState } from 'react'
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Sparklines, SparklinesLine } from 'react-sparklines'

function statusEmoji(status) {
  if (status === 'critical') return '🔴'
  if (status === 'warning') return '🟡'
  return '🟢'
}

const cardTint = {
  healthy: 'bg-emerald-950/60 border-emerald-700',
  warning: 'bg-amber-950/60 border-amber-700',
  critical: 'bg-rose-950/60 border-rose-700',
}

export default function PodGrid({ pods, histories, onSelect }) {
  const [active, setActive] = useState(null)

  const activeHistory = useMemo(() => {
    if (!active) return []
    return (histories[active.id] || []).map((h, idx) => ({ idx: idx + 1, ...h }))
  }, [active, histories])

  return (
    <>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {pods.map((pod) => {
          const spark = histories[pod.id] || []
          return (
            <button
              key={pod.id}
              type="button"
              className={`rounded-lg border p-3 text-left ${cardTint[pod.status] || cardTint.healthy}`}
              onClick={() => {
                setActive(pod)
                onSelect?.(pod.id)
              }}
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="font-semibold">{pod.id}</span>
                <span>{statusEmoji(pod.status)}</span>
              </div>
              <div className="text-sm text-slate-300">{pod.crop}</div>
              <div className="mt-2 text-xs text-slate-300">pH {pod.ph.toFixed(2)} · EC {pod.ec_ppm.toFixed(0)}</div>
              <div className="mt-2 h-10 rounded bg-slate-900/40 p-1">
                <Sparklines data={spark.map((s) => s.ph)}>
                  <SparklinesLine color="#38bdf8" />
                </Sparklines>
              </div>
            </button>
          )
        })}
      </div>

      {active && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/75 p-4" onClick={() => setActive(null)}>
          <div className="w-full max-w-2xl rounded-xl border border-slate-700 bg-slate-900 p-4" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{active.id} history (last 20 ticks)</h3>
              <button className="text-slate-400 hover:text-slate-100" onClick={() => setActive(null)} type="button">✕</button>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeHistory}>
                  <XAxis dataKey="idx" hide />
                  <YAxis yAxisId="ph" domain={[4, 8]} />
                  <YAxis yAxisId="ec" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="ph" type="monotone" dataKey="ph" stroke="#38bdf8" strokeWidth={2} dot={false} />
                  <Line yAxisId="ec" type="monotone" dataKey="ec_ppm" stroke="#22c55e" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
