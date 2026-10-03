import { useState } from 'react'

type Answer = 'replaced' | 'not-replaced'

type Props = {
  theory: Answer | null
  theoryEvidence: string[]
  onSave: (answer: Answer, evidence: string[]) => void
  onReflection: () => void
}

const evidenceOptions = [
  ['MAI_COUPLER_REPLACEMENT_RECORD', 'Maintenance work order says the coupler was replaced.'],
  ['STO_NEW_COUPLER', 'The replacement coupler is still physically present in Storage.'],
  ['STO_NEW_COUPLER_SERIAL', 'Its serial matches the replacement serial on the work order.'],
] as const

export function DeductionScene({ theory, theoryEvidence, onSave, onReflection }: Props) {
  const [answer, setAnswer] = useState<Answer | null>(theory)
  const [selected, setSelected] = useState<string[]>(theoryEvidence)
  const [needsEvidence, setNeedsEvidence] = useState(false)

  const toggleEvidence = (id: string) => {
    setSelected((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id])
  }
  const save = () => {
    if (!answer) return
    if (selected.length === 0) {
      setNeedsEvidence(true)
      return
    }
    setNeedsEvidence(false)
    onSave(answer, selected)
  }

  return (
    <section className="stage-console-scene case-review-scene" data-testid="deduction-scene" aria-labelledby="deduction-title">
      <div className="case-review-backdrop" aria-hidden="true" />
      <div className="stage-console-panel case-review-panel">
      <p className="eyebrow">INCIDENT REVIEW // CURRENT THEORY</p>
      <h2 id="deduction-title">What do you currently believe happened to the coupler?</h2>
      <p className="muted">
        Save a working theory. The case does not tell you immediately whether it is correct.
      </p>

      <fieldset className="classification">
        <legend>Current theory</legend>
        <label>
          <input
            type="radio"
            name="deduction-answer"
            value="replaced"
            checked={answer === 'replaced'}
            onChange={() => setAnswer('replaced')}
          />
          The recorded replacement happened.
        </label>
        <label>
          <input
            type="radio"
            name="deduction-answer"
            value="not-replaced"
            checked={answer === 'not-replaced'}
            onChange={() => setAnswer('not-replaced')}
          />
          The recorded replacement did not actually happen.
        </label>
      </fieldset>

      <fieldset className="evidence-picker">
        <legend>Evidence your theory is based on</legend>
        {evidenceOptions.map(([id, label]) => (
          <label key={id}>
            <input
              type="checkbox"
              checked={selected.includes(id)}
              onChange={() => toggleEvidence(id)}
            />
            {label}
          </label>
        ))}
      </fieldset>
      {needsEvidence && (
        <p className="task-feedback" role="status">
          Choose at least one piece of evidence to record what this theory is based on.
        </p>
      )}

      <div className="button-row">
        <button className="primary" data-testid="save-theory" onClick={save} disabled={!answer}>
          Save current theory
        </button>
        {theory && (
          <button className="secondary" data-testid="open-reflection" onClick={onReflection}>
            Continue to reflection
          </button>
        )}
      </div>

      {theory && (
        <div className="theory-saved" data-testid="theory-saved">
          <strong>Theory saved.</strong>
          <span>No correctness judgment is shown at this stage.</span>
        </div>
      )}
      </div>
    </section>
  )
}
