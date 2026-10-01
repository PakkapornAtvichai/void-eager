import { COUPLER } from '../content/coupler'
import { POWER_SPIKE } from '../content/power'

type Props = {
  onCoupler: () => void
  onPower: () => void
}

export function HubScene({ onCoupler, onPower }: Props) {
  return (
    <section className="scene-card" data-testid="hub-scene" aria-labelledby="hub-title">
      <p className="eyebrow">INCIDENT BOARD // ACTIVE THREADS</p>
      <h2 id="hub-title">Choose what to investigate next</h2>
      <p className="muted">
        The interruption is over. Your previous task is not reopened automatically.
      </p>

      <div className="thread-grid">
        <article className="thread-card">
          <span>THREAD A</span>
          <strong>{COUPLER.thread}</strong>
          <p>Maintenance record + replacement part trail.</p>
          <button className="secondary" data-testid="open-coupler-thread" onClick={onCoupler}>
            Open Coupler thread
          </button>
        </article>

        <article className="thread-card">
          <span>THREAD B</span>
          <strong>{POWER_SPIKE.thread}</strong>
          <p>Engineering power log around 21:11–21:12.</p>
          <button className="secondary" data-testid="open-power-thread" onClick={onPower}>
            Open Power Spike thread
          </button>
        </article>
      </div>
    </section>
  )
}
