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
    <section className="stage-console-scene secondary-system-scene" data-testid="secondary-scene" aria-labelledby="secondary-title">
      <img
        className="stage-console-backdrop"
        src={MAINTENANCE_ASSETS.focusedWorkstation}
        alt=""
        aria-hidden="true"
      />
      <div className="stage-console-dimmer" aria-hidden="true" />

      <div className="stage-console-panel secondary-console-panel">
        <header className="stage-console-header">
          <span>INCIDENT SYSTEM // ALERT C-17</span>
          <strong>ATTENTION REQUIRED</strong>
        </header>

        <div className="stage-console-body">
          <p className="eyebrow">COOLANT TELEMETRY</p>
          <h2 id="secondary-title">Classify incoming sensor alert</h2>
          <p className="muted">Review the telemetry and choose an operational response.</p>

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
                <input type="radio" name="classification" value="sensor-mismatch"
                  checked={classification === 'sensor-mismatch'}
                  onChange={() => setClassification('sensor-mismatch')} />
                Log sensor mismatch and continue monitoring
              </label>
              <label>
                <input type="radio" name="classification" value="maintenance"
                  checked={classification === 'maintenance'}
                  onChange={() => setClassification('maintenance')} />
                Escalate to immediate maintenance response
              </label>
              <label>
                <input type="radio" name="classification" value="emergency"
                  checked={classification === 'emergency'}
                  onChange={() => setClassification('emergency')} />
                Trigger emergency isolation
              </label>
              <button className="primary" data-testid="confirm-classification"
                onClick={() => classification && onComplete(classification)}
                disabled={!classification}>
                Log response
              </button>
            </fieldset>
          ) : (
            <div className="task-complete console-complete">
              <strong>RESPONSE LOGGED</strong>
              <span>Recorded action: {response ?? 'Unspecified'}</span>
              <button className="navigation-button" data-testid="return-investigation" onClick={onReturn}>
                Return to incident board
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
