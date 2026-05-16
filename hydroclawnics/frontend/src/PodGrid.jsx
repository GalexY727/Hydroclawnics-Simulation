import { useMemo } from 'react'

const cropEmoji = {
  basil: '🌱',
  lettuce: '🥬',
  spinach: '🍃',
}

const statusStyles = {
  healthy: { background: 'var(--color-success)', color: 'var(--color-bg)' },
  warning: { background: 'var(--color-warning)', color: 'var(--color-bg)' },
  critical: { background: 'var(--color-critical)', color: 'var(--color-text)' },
}

function formatReading(value, digits = 1) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return '--'
  return numeric.toFixed(digits)
}

function formatAge(hours) {
  const numeric = Number(hours || 0)
  const wholeHours = Math.floor(numeric)
  const minutes = Math.round((numeric - wholeHours) * 60)
  return `${wholeHours}h ${minutes}m`
}

function StatusBadge({ status }) {
  const normalized = status || 'healthy'
  return (
    <span className="rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.02em]" style={statusStyles[normalized] || statusStyles.healthy}>
      {normalized}
    </span>
  )
}

function Reading({ label, value }) {
  return (
    <div className="grid grid-cols-[34px_1fr] items-baseline gap-1">
      <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
        {label}
      </span>
      <span className="truncate text-right font-mono text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
        {value}
      </span>
    </div>
  )
}

export default function PodGrid({ pods, onSelect }) {
  const podList = useMemo(() => Object.values(pods), [pods])

  if (podList.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center rounded-lg border text-sm italic" style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
        Waiting for pod telemetry...
      </div>
    )
  }

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 overflow-hidden md:grid-cols-4 xl:grid-cols-5">
      {podList.map((pod) => (
        <button
          key={pod.id}
          type="button"
          className="calm-card min-h-0 rounded-lg border p-3 text-left transition-colors duration-200"
          onClick={() => onSelect?.(pod.id)}
        >
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="truncate text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                {pod.id} <span aria-hidden="true">{cropEmoji[pod.crop] || '🌱'}</span>
              </div>
              <div className="mt-1 truncate text-xs capitalize" style={{ color: 'var(--color-muted)' }}>
                {pod.crop}
              </div>
            </div>
            <StatusBadge status={pod.status} />
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            <Reading label="pH" value={formatReading(pod.ph, 2)} />
            <Reading label="EC" value={`${formatReading(pod.ec_ppm, 0)} ppm`} />
            <Reading label="Temp" value={`${formatReading(pod.temp_c, 1)}°C`} />
            <Reading label="Age" value={formatAge(pod.age_hours)} />
          </div>
        </button>
      ))}
    </div>
  )
}
