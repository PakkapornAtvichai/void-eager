import type { GameState } from '../game/types'

export function StatusRail({ state }: { state: GameState }) {
  return (
    <aside className="status-rail" data-testid="status-rail" aria-label="Investigation status">
      <div>
        <p className="eyebrow">CURRENT THREAD</p>
        <p>{state.currentThread ?? 'No active investigation thread'}</p>
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
            <span>{state.quickPin.evidenceLabel}</span>
            <span>{state.quickPin.location}</span>
          </>
        ) : (
          <p>Empty</p>
        )}
      </div>
    </aside>
  )
}
