import type { QuickPin } from '../game/types'

type Props = {
  pin: QuickPin
  canResume: boolean
  onResume: () => void
}

export function QuickPinCard({ pin, canResume, onResume }: Props) {
  return (
    <aside className="quick-pin-card" data-testid="quick-pin-card">
      <p className="eyebrow">PINNED CONTEXT</p>
      <strong>{pin.thread}</strong>
      <span>{pin.location}</span>
      <p>{pin.context}</p>
      <button className="secondary" data-testid="resume-pin" onClick={onResume} disabled={!canResume}>
        {canResume ? 'Resume pinned thread' : 'Resume after incident'}
      </button>
    </aside>
  )
}
