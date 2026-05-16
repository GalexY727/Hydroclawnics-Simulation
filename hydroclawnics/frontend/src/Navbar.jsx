import lettuceLogo from '../../../media/lettuce.png'

const statusColor = {
  connected: 'var(--color-success)',
  connecting: 'var(--color-warning)',
  disconnected: 'var(--color-critical)',
}

function formatStatus(status) {
  return `${status || 'disconnected'}`.replace(/^\w/, (letter) => letter.toUpperCase())
}

export default function Navbar({ connectionStatus, healthSummary }) {
  const status = connectionStatus || 'disconnected'

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b px-3 md:px-4" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md border p-1" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
          <img src={lettuceLogo} alt="" className="h-full w-full object-contain" />
        </div>
        <h1 className="truncate text-xl font-semibold leading-none tracking-[-0.5px]" style={{ color: 'var(--color-text)' }}>
          Hydroclawnics <span aria-hidden="true">🌱</span>
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-3 text-xs md:gap-5" style={{ color: 'var(--color-muted)' }}>
        <div className="flex items-center gap-2">
          <span className="connection-dot h-2.5 w-2.5 rounded-full" style={{ background: statusColor[status] || statusColor.disconnected }} />
          <span className="hidden sm:inline">{formatStatus(status)}</span>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <span>{healthSummary.healthy} Healthy</span>
          <span aria-hidden="true">|</span>
          <span>{healthSummary.warning} Warning</span>
          <span aria-hidden="true">|</span>
          <span>{healthSummary.critical} Critical</span>
        </div>
        <button type="button" className="grid h-8 w-8 place-items-center rounded-md transition-colors hover:bg-[color:var(--color-hover)]" aria-label="Settings">
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
            <path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.04.04a2.1 2.1 0 0 1-2.97 2.97l-.04-.04a1.8 1.8 0 0 0-1.98-.36 1.8 1.8 0 0 0-1.09 1.65V21a2.1 2.1 0 0 1-4.2 0v-.06a1.8 1.8 0 0 0-1.09-1.65 1.8 1.8 0 0 0-1.98.36l-.04.04a2.1 2.1 0 1 1-2.97-2.97l.04-.04A1.8 1.8 0 0 0 3.84 15a1.8 1.8 0 0 0-1.65-1.09H2.1a2.1 2.1 0 0 1 0-4.2h.09a1.8 1.8 0 0 0 1.65-1.09 1.8 1.8 0 0 0-.36-1.98l-.04-.04a2.1 2.1 0 1 1 2.97-2.97l.04.04a1.8 1.8 0 0 0 1.98.36 1.8 1.8 0 0 0 1.09-1.65V2.1a2.1 2.1 0 0 1 4.2 0v.09a1.8 1.8 0 0 0 1.09 1.65 1.8 1.8 0 0 0 1.98-.36l.04-.04a2.1 2.1 0 1 1 2.97 2.97l-.04.04a1.8 1.8 0 0 0-.36 1.98 1.8 1.8 0 0 0 1.65 1.09h.09a2.1 2.1 0 0 1 0 4.2h-.09A1.8 1.8 0 0 0 19.4 15Z" />
          </svg>
        </button>
      </div>
    </header>
  )
}
