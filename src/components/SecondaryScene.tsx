import { useState } from 'react'

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
    <section className="scene-card" data-testid="secondary-scene" aria-labelledby="secondary-title">
      <p className="eyebrow">INCIDENT SYSTEM // ALERT C-17</p>
      <h2 id="secondary-title">Classify coolant telemetry alert</h2>
      <p className="muted">
        Review the alert and choose an operational response. The system records your choice.
      </p>

      <div className="system-panel alert-data">
        <span>Coolant sensor A: 72.1 C</span>
        <span>Coolant sensor B: 54.0 C</span>
        <span>Line pressure: stable</span>
        <span>Flow rate: nominal</span>
        <span>Diagnostic: Sensor B signal intermittent</span>
      </div>
      {!complete ? (
        <fieldset className="classification">
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
        <div className="task-complete">
          <strong>Response logged.</strong>
          <span>Recorded action: {response ?? 'Unspecified'}</span>
          <button className="primary" data-testid="return-investigation" onClick={onReturn}>
            Return to incident board
          </button>
        </div>
      )}
    </section>
  )
}
