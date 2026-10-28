import { useState } from 'react'
import { MAINTENANCE_ASSETS } from '../content/maintenanceAssets'

type Classification = 'sensor-mismatch' | 'maintenance' | 'emergency'

type Props = {
  complete: boolean
  response: string | null
  onComplete: (response: Classification) => void
  onReturn: () => void
}

export function SecondaryScene({ complete, response, onComplete, onReturn }: Props) {
  const [classification, setClassification] = useState<Classification | null>(null)

  return (
    <section
      className="secondary-workstation-scene"
      data-testid="secondary-scene"
      aria-labelledby="secondary-title"
    >
      <img
        className="secondary-workstation-background"
        src={MAINTENANCE_ASSETS.focusedWorkstation}
        alt="Glint's workstation while the incident system takes over the main display"
      />
      <div className="secondary-workstation-dimmer" aria-hidden="true" />

      <div className="secondary-monitor-interface">
        <header className="secondary-monitor-header">
          <span>INCIDENT SYSTEM // ALERT C-17</span>
          <strong>ATTENTION REQUIRED</strong>
        </header>

        <div className="secondary-monitor-body">
          <p className="eyebrow">COOLANT TELEMETRY</p>
          <h2 id="secondary-title">Classify incoming sensor alert</h2>
          <p className="muted">Shipwide monitoring sent this alert to your workstation. Classify it before returning to your Coupler investigation.</p>

          <div className="telemetry-grid" aria-label="Coolant telemetry">
            <div><span>SENSOR A</span><strong>72.1 C</strong></div>
            <div><span>SENSOR B</span><strong>54.0 C</strong></div>
            <div><span>PRESSURE</span><strong>STABLE</strong></div>
            <div><span>FLOW</span><strong>NOMINAL</strong></div>
          </div>

          <div className="diagnostic-line">
            <span>DIAGNOSTIC</span>
            <strong>SENSOR B SIGNAL INTERMITTENT</strong>
          </div>

          {!complete ? (
            <fieldset className="classification console-classification">
              <legend>Response classification</legend>
              <label>
                <input
                  type="radio"
                  name="classification"
                  value="sensor-mismatch"
                  checked={classification === 'sensor-mismatch'}
                  onChange={() => setClassification('sensor-mismatch')}
                />
                Log sensor mismatch and continue monitoring
              </label>
              <label>
                <input
                  type="radio"
                  name="classification"
                  value="maintenance"
                  checked={classification === 'maintenance'}
                  onChange={() => setClassification('maintenance')}
                />
                Escalate to immediate maintenance response
              </label>
              <label>
                <input
                  type="radio"
                  name="classification"
                  value="emergency"
                  checked={classification === 'emergency'}
                  onChange={() => setClassification('emergency')}
                />
                Trigger emergency isolation
              </label>

              <button
                className="primary"
                data-testid="confirm-classification"
                onClick={() => classification && onComplete(classification)}
                disabled={!classification}
              >
                Log response
              </button>
            </fieldset>
          ) : (
            <div className="task-complete console-complete">
              <strong>RESPONSE LOGGED</strong>
              <span>Recorded action: {response ?? 'Unspecified'}</span>
              <p>Alert C-17 is logged. You are still at the Maintenance workstation; travel to the Incident Hub to choose which investigation thread to resume.</p>
              <button className="navigation-button" data-testid="return-investigation" onClick={onReturn}>
                Travel to Incident Hub
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
