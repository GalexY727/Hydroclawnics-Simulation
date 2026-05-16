function severityClass(entry) {
  const diagnosis = `${entry.diagnosis || ''}`.toLowerCase()
  if (diagnosis.includes('critical') || diagnosis.includes('crash') || diagnosis.includes('stress')) return 'border-rose-500'
  if (diagnosis.includes('warning') || diagnosis.includes('low') || diagnosis.includes('spike')) return 'border-amber-400'
  return 'border-emerald-500'
}

export default function AgentLog({ entries }) {
  return (
    <section className="flex h-full min-h-[720px] flex-col rounded-xl border border-slate-700 bg-slate-900 p-4">
      <h2 className="mb-3 text-xl font-semibold">Agent Reasoning Feed</h2>
      <div className="space-y-3 overflow-y-auto pr-1">
        {entries.map((entry, idx) => (
          <article key={`${entry.timestamp}-${entry.pod_id}-${idx}`} className={`rounded-md border-l-4 bg-slate-800/70 p-3 ${severityClass(entry)}`}>
            <div className="text-xs text-slate-400">{entry.timestamp}</div>
            <div className="text-sm font-semibold">{entry.pod_id} · {entry.diagnosis}</div>
            <div className="text-sm text-slate-300">Action: {entry.action}</div>
            <p className="mt-1 text-xs text-slate-300">
              <span className="typewriter">{`${entry.reasoning || ''}`.slice(0, 150)}</span>
            </p>
          </article>
        ))}
        {entries.length === 0 && <p className="text-sm text-slate-500">No agent decisions yet.</p>}
      </div>
    </section>
  )
}
