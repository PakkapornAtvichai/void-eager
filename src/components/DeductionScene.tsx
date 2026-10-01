import { useState } from 'react'

type Answer = 'replaced' | 'not-replaced'

type Props = {
  deduction: string | null
  onSubmit: (answer: Answer) => void
  onReflection: () => void
}

const requiredEvidence = [
  'MAI_COUPLER_REPLACEMENT_RECORD',
  'STO_NEW_COUPLER',
  'STO_NEW_COUPLER_SERIAL',
] as const

export function DeductionScene({ deduction, onSubmit, onReflection }: Props) {
  const [answer, setAnswer] = useState<Answer | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [supportError, setSupportError] = useState(false)

  const toggleEvidence = (id: string) => {
    setSelected((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id])
  }
  const submit = () => {
    if (!answer) return
    const hasSupport = requiredEvidence.every((id) => selected.includes(id))
    if (!hasSupport) {
      setSupportError(true)
      return
    }
    setSupportError(false)
    onSubmit(answer)
  }

  return (
    <section className="scene-card" data-testid="deduction-scene" aria-labelledby="deduction-title">
      <p className="eyebrow">INCIDENT REVIEW // DEDUCTION</p>
      <h2 id="deduction-title">Was the stabilizer coupler actually replaced?</h2>
      <p className="muted">
        Choose a conclusion, then select the evidence that supports it.
      </p>

      <fieldset className="classification">
        <legend>Conclusion</legend>
        <label>
          <input
            type="radio"
            name="deduction-answer"
            value="replaced"
            checked={answer === 'replaced'}
            onChange={() => setAnswer('replaced')}
          />
          Yes — the coupler was replaced.
        </label>
        <label>
          <input
            type="radio"
            name="deduction-answer"
            value="not-replaced"
            checked={answer === 'not-replaced'}
            onChange={() => setAnswer('not-replaced')}
          />
          No — the replacement did not actually happen.
        </label>
      </fieldset>

      <fieldset className="evidence-picker">
        <legend>Supporting evidence</legend>
        <label>
          <input
            type="checkbox"
            checked={selected.includes('MAI_COUPLER_REPLACEMENT_RECORD')}
            onChange={() => toggleEvidence('MAI_COUPLER_REPLACEMENT_RECORD')}
          />
          Maintenance work order says the coupler was replaced.
        </label>
        <label>
          <input
            type="checkbox"
            checked={selected.includes('STO_NEW_COUPLER')}
            onChange={() => toggleEvidence('STO_NEW_COUPLER')}
          />
          The replacement coupler is still in Storage.
        </label>
        <label>
          <input
            type="checkbox"
            checked={selected.includes('STO_NEW_COUPLER_SERIAL')}
            onChange={() => toggleEvidence('STO_NEW_COUPLER_SERIAL')}
          />
          Its serial matches the replacement serial on the work order.
        </label>
      </fieldset>
      {supportError && (
        <p className="task-feedback" role="status">
          Support the conclusion with the full record + physical-part + serial chain.
        </p>
      )}

      {deduction === 'incorrect' && (
        <p className="task-feedback" role="status">
          That conclusion does not explain why the documented replacement part is still in Storage.
        </p>
      )}

      {deduction === 'correct' ? (
        <div className="task-complete" data-testid="deduction-correct">
          <strong>Deduction supported.</strong>
          <span>The recorded replacement conflicts with the physical and serial evidence.</span>
          <button className="primary" data-testid="open-reflection" onClick={onReflection}>
            Continue to reflection
          </button>
        </div>
      ) : (
        <button className="primary" data-testid="submit-deduction" onClick={submit} disabled={!answer}>
          Submit deduction
        </button>
      )}
    </section>
  )
}
