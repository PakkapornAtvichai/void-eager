import { useState } from 'react'
import { MAINTENANCE_ASSETS } from '../content/maintenanceAssets'

type Classification = 'sensor-mismatch' | 'maintenance' | 'emergency'

type Props = {
  complete: boolean
  response: string | null
  originLabel: string
  fromWorkstation: boolean
  onComplete: (response: Classification) => void
  onReturnPrevious: () => void
  onReturnHub: () => void
}

const responseCopy: Record<Classification, string> = {
  'sensor-mismatch': 'Sensor mismatch logged. Continued monitoring requested.',
  maintenance: 'Maintenance inspection requested. Alert response logged.',
  emergency: 'Isolation request transmitted. Alert response logged.',
}

export function SecondaryScene({
  complete, response, originLabel, fromWorkstation, onComplete, onReturnPrevious, onReturnHub,
}: Props) {
  const [classification, setClassification] = useState<Classification | null>(null)

  return (
    <section
      className="secondary-workstation-scene"
      data-testid="secondary-scene"
      aria-labelledby="secondary-title"
    >
      {fromWorkstation ? (
        <img
          className="secondary-workstation-background"
          src={MAINTENANCE_ASSETS.focusedWorkstation}
          alt=""
          aria-hidden="true"
        />
      ) : (
        <div className="secondary-remote-background" aria-hidden="true" />
      )}
      <div className="secondary-workstation-dimmer" aria-hidden="true" />

      <div className="secondary-monitor-interface">
        <header className="secondary-monitor-header">
          <span>SHIPWIDE SYSTEM // ALERT C-17</span>
          <strong>REMOTE CONSOLE</strong>
        </header>

        <div className="secondary-monitor-body">
          <p className="eyebrow">COOLANT TELEMETRY</p>
          <h2 id="secondary-title">Classify incoming sensor alert</h2>
          <p className="muted">Ship systems routed this task to your current terminal. Your previous task at {originLabel} remains available.</p>

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
              <span data-testid="coolant-response-summary">
                {response && response in responseCopy
                  ? responseCopy[response as Classification]
                  : 'Response recorded.'}
              </span>
              <p>Your investigation remains available. Choose where to go next.</p>
              <div className="incident-return-actions">
                <button className="primary" data-testid="return-previous-task" onClick={onReturnPrevious}>
                  RETURN TO PREVIOUS TASK // {originLabel}
                </button>
                <button className="navigation-button" data-testid="return-investigation" onClick={onReturnHub}>
                  INCIDENT HUB
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
