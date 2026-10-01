import { useState } from 'react'
import type { QuickPin } from '../game/types'

type Props = {
  quickPin: QuickPin | null
  complete: boolean
  onComplete: () => void
  onReturn: () => void
}

type Classification = 'sensor-mismatch' | 'maintenance' | 'emergency'

export function SecondaryScene({ quickPin, complete, onComplete, onReturn }: Props) {
  const [classification, setClassification] = useState<Classification | null>(null)
  const [needsReview, setNeedsReview] = useState(false)

  const submit = () => {
    if (classification === 'sensor-mismatch') {
      setNeedsReview(false)
      onComplete()
      return
    }
    setNeedsReview(true)
  }

  return (
    <section className="scene-card" aria-labelledby="secondary-title">
      <p className="eyebrow">INCIDENT SYSTEM // ALERT C-17</p>
      <h2 id="secondary-title">Classify coolant telemetry alert</h2>
      <p className="muted">
        Review the alert data and choose the appropriate response.
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
          {needsReview && (
            <p className="task-feedback" role="status">
              Recheck the stable pressure, nominal flow, and intermittent sensor signal.
            </p>
          )}
          <button className="primary" onClick={submit} disabled={!classification}>
            Confirm classification
          </button>
        </fieldset>
      ) : (
        <div className="task-complete">
          <strong>Alert classified.</strong>
          <span>No immediate intervention required.</span>
          <button className="primary" onClick={onReturn}>
            Return to investigation
          </button>
        </div>
      )}

      {quickPin && <p className="pin-confirm">Quick Pin saved before switching.</p>}
    </section>
  )
}
