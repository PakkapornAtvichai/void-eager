import { COUPLER } from '../content/coupler'
import { POWER_SPIKE } from '../content/power'

type Props = {
  onCoupler: () => void
  onPower: () => void
}

export function HubScene({ onCoupler, onPower }: Props) {
  return (
    <section className="stage-console-scene incident-board-scene" data-testid="hub-scene" aria-labelledby="hub-title">
      <div className="system-grid-backdrop" aria-hidden="true" />
      <div className="stage-console-panel incident-board-panel">
        <header className="stage-console-header">
          <span>INCIDENT BOARD // ACTIVE THREADS</span>
          <strong>02 OPEN</strong>
        </header>
        <div className="stage-console-body">
          <p className="eyebrow">THREAD SELECTION</p>
          <h2 id="hub-title">Choose what to investigate next</h2>
          <p className="muted">The interruption is over. Your previous task is not reopened automatically.</p>

          <div className="thread-grid thread-grid--console">
            <article className="thread-card thread-card--console">
              <span>THREAD A // MAINTENANCE</span>
              <strong>{COUPLER.thread}</strong>
              <p>Maintenance record + replacement part trail.</p>
              <button className="console-choice" data-testid="open-coupler-thread" onClick={onCoupler}>
                Open Coupler thread
              </button>
            </article>

            <article className="thread-card thread-card--console">
              <span>THREAD B // ENGINEERING</span>
              <strong>{POWER_SPIKE.thread}</strong>
              <p>Engineering power log around 21:11–21:12.</p>
              <button className="console-choice" data-testid="open-power-thread" onClick={onPower}>
                Open Power Spike thread
              </button>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
