import { COUPLER } from '../content/coupler'
import { POWER_SPIKE } from '../content/power'
import type { GameState } from '../game/types'

const threadText = (thread: GameState['currentThread']) => {
  if (thread === 'coupler') return COUPLER.thread
  if (thread === 'power') return POWER_SPIKE.thread
  return 'Choose an active investigation thread'
}

export function StatusRail({ state }: { state: GameState }) {
  return (
    <aside className="status-rail" data-testid="status-rail" aria-label="Investigation status">
      <div>
        <p className="eyebrow">CURRENT THREAD</p>
        <p>{threadText(state.currentThread)}</p>
      </div>
      <div>
        <p className="eyebrow">EVIDENCE</p>
        <p>{state.evidenceFound.length} logged</p>
      </div>
      <div>
        <p className="eyebrow">QUICK PIN</p>
        {state.quickPin ? (
          <>
            <strong>{state.quickPin.thread}</strong>
            <span>{state.quickPin.location}</span>
            <span>{state.quickPin.context}</span>
          </>
        ) : (
          <p>Empty</p>
        )}
      </div>
    </aside>
  )
}
