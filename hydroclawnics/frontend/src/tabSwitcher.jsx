const tabs = [
  { id: 'grid', label: '2D Grid' },
  { id: 'farm', label: '3D Farm' },
]

export default function TabSwitcher({ value, onChange }) {
  return (
    <div className="flex shrink-0 items-center gap-5 border-b" style={{ borderColor: 'var(--color-border)' }} aria-label="Farm view mode">
      {tabs.map((tab) => {
        const active = value === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            className="relative -mb-px px-0 pb-2 pt-0 text-sm font-semibold transition-colors"
            style={{
              color: active ? 'var(--color-text)' : 'var(--color-muted)',
              borderBottom: active ? '2px solid var(--color-info)' : '2px solid transparent',
            }}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
