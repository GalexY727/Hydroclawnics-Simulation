import Plot from 'react-plotly.js'

function Gauge({ label, value, min, max, suffix, color }) {
  return (
    <div className="rounded-lg bg-slate-950 p-1">
      <Plot
        data={[
          {
            type: 'indicator',
            mode: 'gauge+number',
            value,
            number: { suffix },
            title: { text: label },
            gauge: {
              axis: { range: [min, max] },
              bar: { color },
            },
          },
        ]}
        layout={{
          margin: { t: 30, b: 10, l: 10, r: 10 },
          paper_bgcolor: '#020617',
          font: { color: '#cbd5e1' },
          height: 210,
        }}
        style={{ width: '100%', height: '210px' }}
        useResizeHandler
        config={{ displayModeBar: false }}
      />
    </div>
  )
}

export default function PhysicalPot({ pod }) {
  if (!pod) {
    return null
  }

  const statusClasses = {
    healthy: 'border-emerald-500',
    warning: 'border-amber-400',
    critical: 'border-rose-500',
  }

  return (
    <section className={`rounded-xl border-2 ${statusClasses[pod.status] || statusClasses.healthy} bg-slate-900 p-4`}>
      <h2 className="text-xl font-semibold">Pot Alpha (Physical)</h2>
      <p className="mb-3 text-sm text-slate-400">{pod.id} · {pod.crop}</p>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-slate-800 p-3">
          <div className="text-xs uppercase tracking-wide text-slate-400">pH</div>
          <div className="text-2xl font-bold">{pod.ph.toFixed(2)}</div>
        </div>
        <div className="rounded-lg bg-slate-800 p-3">
          <div className="text-xs uppercase tracking-wide text-slate-400">EC</div>
          <div className="text-2xl font-bold">{pod.ec_ppm.toFixed(0)} <span className="text-sm">ppm</span></div>
        </div>
        <div className="rounded-lg bg-slate-800 p-3">
          <div className="text-xs uppercase tracking-wide text-slate-400">Temp</div>
          <div className="text-2xl font-bold">{pod.temp_c.toFixed(1)} <span className="text-sm">°C</span></div>
        </div>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <Gauge label="pH" value={pod.ph} min={3} max={8} suffix="" color="#38bdf8" />
        <Gauge label="EC" value={pod.ec_ppm} min={300} max={1800} suffix=" ppm" color="#22c55e" />
        <Gauge label="Temp" value={pod.temp_c} min={10} max={40} suffix="°C" color="#f97316" />
      </div>
      {pod.last_action ? (
        <p className="mt-3 text-sm text-slate-300">Last action: {pod.last_action}</p>
      ) : null}
    </section>
  )
}
