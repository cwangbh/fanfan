import { useEffect, type ReactNode } from 'react'
import { formatGrams, round } from '../lib/planner.ts'

export function Sheet({ title, onClose, children, actions }: { title: string; onClose: () => void; children: ReactNode; actions?: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <h2>{title}</h2>
          {actions}
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Check({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <label className={`check${checked ? ' done' : ''}`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <div className="check-text">{children}</div>
    </label>
  )
}

export function Progress({ value, target, label, unit = 'g' }: { value: number; target: number; label: string; unit?: string }) {
  const pct = target ? (value / target) * 100 : 0
  const fmt = (v: number) => (unit === 'g' ? formatGrams(round(v)) : `${Math.round(v)} ${unit}`)
  return (
    <div className="stack" style={{ gap: 4 }}>
      <div className="row small">
        <span>{label}</span>
        <span className="spacer" />
        <span>
          <b>{fmt(value)}</b> <span className="muted">/ {fmt(target)}</span>
        </span>
      </div>
      <div className={`progress${pct > 110 ? ' over' : ''}`}>
        <div style={{ width: `${Math.min(100, pct)}%` }} />
      </div>
    </div>
  )
}

export function Segmented<T extends string>({ value, options, onChange }: { value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <div className="segmented" role="tablist">
      {options.map(([v, label]) => (
        <button key={v} role="tab" aria-selected={v === value} className={v === value ? 'active' : ''} onClick={() => onChange(v)}>
          {label}
        </button>
      ))}
    </div>
  )
}
