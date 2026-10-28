import { COUPLER } from '../content/coupler'
import { POWER_SPIKE } from '../content/power'
import type { GameState } from '../game/types'

type Props = {
  state: GameState
  location: string
  storageLeadUnlocked: boolean
  storageSerialChecked: boolean
  canFollowStorageLead: boolean
  canResumePin: boolean
  onFollowStorageLead: () => void
  onResumePin: () => void
}

const contextLabel = (state: GameState) => {
  if (state.scene === 'secondary') return 'CURRENT TASK'
  if (state.scene === 'hub') return 'THREAD SELECTION'
  if (state.scene === 'reflection') return 'CASE STATUS'
  return 'CURRENT THREAD'
}

const contextText = (state: GameState) => {
  if (state.scene === 'secondary') return 'Coolant telemetry incident C-17'
  if (state.scene === 'hub') return 'Choose an investigation thread'
  if (state.scene === 'reflection') return 'Loop complete'
  if (state.currentThread === 'coupler') return COUPLER.thread
  if (state.currentThread === 'power') return POWER_SPIKE.thread
  return 'No active thread'
}

export function StatusRail({
  state,
  location,
  storageLeadUnlocked,
  storageSerialChecked,
  canFollowStorageLead,
  canResumePin,
  onFollowStorageLead,
  onResumePin,
}: Props) {
  const reflection = state.scene === 'reflection'
  const storageCurrent = state.scene === 'storage' && !storageSerialChecked
  const storageComplete = storageLeadUnlocked && storageSerialChecked

  return (
    <aside
      className={`status-rail game-hud ${reflection ? 'game-hud--reflection' : ''}`}
      data-testid="status-rail"
      aria-label="Investigation status"
    >
      <section className="hud-location">
        <span className="hud-kicker">LOCATION</span>
        <strong>{location}</strong>
      </section>

      <section className="hud-block hud-thread-block">
        <span className="hud-kicker">{contextLabel(state)}</span>
        <strong className="hud-thread">{contextText(state)}</strong>
      </section>

      {!reflection && (
        <section className="hud-block hud-leads" aria-label="Active leads">
          <div className="hud-section-heading">
            <span className="hud-kicker">LEADS</span>
            <strong>{storageLeadUnlocked ? '01' : '00'}</strong>
          </div>

          {!storageLeadUnlocked ? (
            <span className="hud-empty">No actionable leads</span>
          ) : storageComplete ? (
            <div className="hud-lead-status is-complete" data-testid="storage-lead-complete">
              <span>REPLACEMENT SERIAL</span>
              <small>STORAGE B-04 // COMPLETE</small>
            </div>
          ) : storageCurrent ? (
            <div className="hud-lead-status is-current" data-testid="storage-lead-current">
              <span>REPLACEMENT SERIAL</span>
              <small>STORAGE B-04 // CURRENT</small>
            </div>
          ) : (
            <button
              type="button"
              className="hud-lead is-new-lead"
              data-testid="storage-lead"
              onClick={onFollowStorageLead}
              disabled={!canFollowStorageLead}
            >
              <em>AVAILABLE</em>
              <span>TRACE REPLACEMENT SERIAL</span>
              <small>GSC-8842-A → STORAGE B-04</small>
            </button>
          )}
        </section>
      )}

      {!reflection && (
        canResumePin && state.quickPin ? (
          <details className="hud-pin" data-testid="quick-pin-entry">
            <summary aria-label="Open saved Quick Pin context">
              <span>
                <span className="hud-kicker">QUICK PIN</span>
                <small>Saved context</small>
              </span>
              <strong>01</strong>
            </summary>
            <div className="hud-pin-panel">
              <strong>{state.quickPin.thread}</strong>
              <span>{state.quickPin.location}</span>
              <p>{state.quickPin.context}</p>
              <button
                type="button"
                className="hud-action"
                data-testid="resume-pin"
                onClick={onResumePin}
              >
                RESUME REPORT
              </button>
            </div>
          </details>
        ) : (
          <section
            className="hud-pin hud-pin-static"
            data-testid="quick-pin-entry"
            aria-label="Quick Pin status"
          >
            <div className="hud-pin-summary">
              <span>
                <span className="hud-kicker">QUICK PIN</span>
                <small>{state.quickPin ? 'Saved context' : 'Empty'}</small>
              </span>
              <strong>{state.quickPin ? '01' : '00'}</strong>
            </div>
          </section>
        )
      )}

      <section className="hud-evidence" aria-label="Evidence count">
        <span className="hud-kicker">EVIDENCE</span>
        <strong>{String(state.evidenceFound.length).padStart(2, '0')}</strong>
      </section>
    </aside>
  )
}
