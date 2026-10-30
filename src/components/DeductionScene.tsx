import { useState } from 'react'
import { evidenceCatalog } from '../game/evidence'

type Answer = 'replaced' | 'not-replaced'

type Props = {
  theory: Answer | null
  theoryEvidence: string[]
  observedEvidence: string[]
  comparedEvidenceIds: string[]
  onSave: (answer: Answer, evidence: string[]) => void
  onBack: () => void
}

export function DeductionScene({
  theory, theoryEvidence, observedEvidence, comparedEvidenceIds, onSave, onBack,
}: Props) {
  const [answer, setAnswer] = useState<Answer | null>(theory)
  const [selected, setSelected] = useState<string[]>(theoryEvidence.filter((id) => observedEvidence.includes(id)))
  const [needsEvidence, setNeedsEvidence] = useState(false)
  const available = evidenceCatalog.filter(({ id }) => observedEvidence.includes(id))
  const savedSelection = theoryEvidence.filter((id) => observedEvidence.includes(id))
  const hasChanges = answer !== theory ||
    selected.length !== savedSelection.length ||
    selected.some((id) => !savedSelection.includes(id))

  const toggleEvidence = (id: string) => {
    setSelected((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id])
    setNeedsEvidence(false)
  }

  const save = () => {
    if (!answer) return
    if (!selected.length) {
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
        <p className="eyebrow">INCIDENT REVIEW // WORKING THEORY</p>
        <h2 id="deduction-title">What do you currently believe happened to the Coupler?</h2>
        <p className="muted">Choose a provisional interpretation. Cite only sources you have actually inspected. You can revise this later.</p>

        {comparedEvidenceIds.length > 0 && (
          <p className="case-comparison-status" data-testid="case-comparison-status">
            SOURCE PAIRING SAVED // Maintenance and Storage records cross-checked. The comparison does not choose a conclusion.
          </p>
        )}

        <fieldset className="classification">
          <legend>Current interpretation</legend>
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

        <fieldset className="evidence-picker" data-testid="case-evidence-picker">
          <legend>Evidence actually observed ({available.length})</legend>
          {available.map(({ id, label }) => (
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
            Choose at least one observed source. You can return to investigate without saving.
          </p>
        )}

        {theory && (
          <p className={hasChanges ? 'case-unsaved-note' : 'theory-saved'} data-testid="theory-saved">
            <strong>{hasChanges ? 'Unsubmitted changes' : 'Working theory saved'}</strong>
            <span>
              {hasChanges
                ? 'Select SAVE WORKING THEORY to update your previous interpretation.'
                : 'Your recorded interpretation can be revisited and changed at any time before ending the session.'}
            </span>
          </p>
        )}

        <div className="button-row case-review-actions">
          <button className="primary" data-testid="save-theory" onClick={save} disabled={!answer}>
            {theory ? 'SAVE REVISED THEORY' : 'SAVE WORKING THEORY'}
          </button>
          <button className="navigation-button" data-testid="case-review-back-hub" onClick={onBack}>
            ← INCIDENT HUB / KEEP INVESTIGATING
          </button>
        </div>
      </div>
    </section>
  )
}
