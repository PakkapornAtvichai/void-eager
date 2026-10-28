import { useEffect, useState } from 'react'
import type { Objective } from '../game/objectives'

type Props = { objective: Objective }

/** Optional wayfinding aid; it never advances state or picks an answer for the player. */
export function ObjectiveTracker({ objective }: Props) {
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    setShowHint(false)
  }, [objective.id])

  return (
    <aside
      className={`objective-tracker ${showHint ? 'objective-tracker--expanded' : ''}`}
      data-testid="current-objective"
      data-objective-id={objective.id}
      aria-label="Current investigation objective"
    >
      <div className="objective-tracker__row">
        <div className="objective-tracker__content">
          <span className="objective-tracker__eyebrow">NEXT OBJECTIVE // {objective.category}</span>
          <strong className="objective-tracker__title" data-testid="objective-title">
            {objective.title}
          </strong>
        </div>
        <button
          type="button"
          className="objective-tracker__toggle"
          data-testid="objective-hint-toggle"
          aria-expanded={showHint}
          aria-controls="objective-hint"
          onClick={() => setShowHint((current) => !current)}
        >
          {showHint ? 'CLOSE HINT' : 'NEED A HINT?'}
        </button>
      </div>
      {showHint && (
        <div className="objective-tracker__hint" id="objective-hint" data-testid="objective-hint">
          <span>WHERE / WHY</span>
          <p>{objective.hint}</p>
        </div>
      )}
    </aside>
  )
}
