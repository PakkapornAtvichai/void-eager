import { useEffect, useState } from 'react'
import type { Objective } from '../game/objectives'
import { EvidenceModal } from './EvidenceModal'

type Props = { objective: Objective; onOpenBriefing?: () => void }

/** Minimal wayfinding chip. More detail is always optional. */
export function ObjectiveTracker({ objective, onOpenBriefing }: Props) {
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    setShowHint(false)
  }, [objective.id])

  return (
    <>
      <aside
        className="objective-tracker objective-tracker--compact"
        data-testid="current-objective"
        data-objective-id={objective.id}
        aria-label="Current investigation objective"
      >
        <div className="objective-tracker__row">
          <div className="objective-tracker__content">
            <span className="objective-tracker__eyebrow">NEXT // {objective.category}</span>
            <strong className="objective-tracker__title" data-testid="objective-title">{objective.title}</strong>
          </div>
          <button
            type="button"
            className="objective-tracker__toggle"
            data-testid="objective-hint-toggle"
            aria-expanded={showHint}
            onClick={() => setShowHint((current) => !current)}
          >
            {showHint ? 'CLOSE HINT' : 'HINT ?'}
          </button>
        </div>
      </aside>

      {showHint && (
        <EvidenceModal title="Where to look next" kicker="OPTIONAL GUIDANCE" onClose={() => setShowHint(false)} testId="objective-hint-dialog">
          <div data-testid="objective-hint" id="objective-hint">
            <p>{objective.hint}</p>
            {onOpenBriefing && (
              <button
                type="button"
                className="objective-hint__brief-action"
                data-testid="reopen-case-brief"
                onClick={() => {
                  setShowHint(false)
                  onOpenBriefing()
                }}
              >
                CASE BRIEF
              </button>
            )}
          </div>
        </EvidenceModal>
      )}
    </>
  )
}
