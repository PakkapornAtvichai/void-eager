import { COUPLER } from '../content/coupler'
import { POWER_SPIKE } from '../content/power'
import { YOKO_PACK_ASSETS } from '../content/yokoPackAssets'

type Props = {
  onCoupler: () => void
  onPower: () => void
}

export function HubScene({ onCoupler, onPower }: Props) {
  return (
    <section className="hub-stage" data-testid="hub-scene" aria-labelledby="hub-title">
      <img
        className="hub-background"
        src={YOKO_PACK_ASSETS.hubBackground}
        alt="Incident Hub aboard Void-eager with a central command display and corridors leading deeper into the ship"
      />

      <div className="hub-location-tag hub-location-tag--left" aria-hidden="true">
        MAINTENANCE ACCESS
      </div>
      <div className="hub-location-tag hub-location-tag--right" aria-hidden="true">
        ENGINEERING ACCESS
      </div>

      <div className="hub-screen-interface">
        <header className="hub-screen-header">
          <span>INCIDENT BOARD // ACTIVE THREADS</span>
          <strong>02 OPEN</strong>
        </header>

        <div className="hub-screen-body">
          <p className="eyebrow">THREAD SELECTION</p>
          <h2 id="hub-title">Choose what to investigate next</h2>
          <p className="muted">The interruption is over. Your previous task is not reopened automatically.</p>

          <div className="hub-thread-grid">
            <article className="hub-thread-card">
              <span>THREAD A // MAINTENANCE</span>
              <strong>{COUPLER.thread}</strong>
              <small>LOCATION // MAINTENANCE WORKSTATION</small>
              <button className="console-choice" data-testid="open-coupler-thread" onClick={onCoupler}>
                Return to Coupler / Workstation
              </button>
            </article>

            <article className="hub-thread-card">
              <span>THREAD B // ENGINEERING</span>
              <strong>{POWER_SPIKE.thread}</strong>
              <small>LOCATION // ENGINEERING POWER LOG</small>
              <button className="console-choice" data-testid="open-power-thread" onClick={onPower}>
                Open Power Spike / Engineering
              </button>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
