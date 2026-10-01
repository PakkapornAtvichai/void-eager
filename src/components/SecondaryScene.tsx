import type { QuickPin } from '../game/types'

type Props = {
  quickPin: QuickPin | null
}

export function SecondaryScene({ quickPin }: Props) {
  return (
    <section className="scene-card" aria-labelledby="secondary-title">
      <p className="eyebrow">INCIDENT SYSTEM</p>
      <h2 id="secondary-title">Non-critical alert opened</h2>
      <p className="muted">
        The bounded secondary task arrives in T05. T04 currently proves the switch and preserved state.
      </p>
      <div className="system-panel">
        <span>Alert: Coolant telemetry mismatch</span>
        <span>Severity: Non-critical</span>
        <span>Action: Classification pending</span>
      </div>
      {quickPin && <p className="pin-confirm">Quick Pin saved before switching.</p>}
    </section>
  )
}
