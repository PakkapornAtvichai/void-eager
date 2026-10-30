import { COUPLER } from '../content/coupler'
import { POWER_SPIKE } from '../content/power'
import { YOKO_PACK_ASSETS } from '../content/yokoPackAssets'

type Props = {
  storageLeadUnlocked: boolean
  recordOpened: boolean
  serialChecked: boolean
  powerReviewed: boolean
  theorySaved: boolean
  alertComplete: boolean
  alertPending: boolean
  onOpenAlert: () => void
  onCoupler: () => void
  onStorage: () => void
  onPower: () => void
  onCaseReview: () => void
  onEndSession: () => void
}

export function HubScene({
  storageLeadUnlocked,
  recordOpened,
  serialChecked,
  powerReviewed,
  theorySaved,
  alertComplete,
  alertPending,
  onOpenAlert,
  onCoupler,
  onStorage,
  onPower,
  onCaseReview,
  onEndSession,
}: Props) {
  return (
    <section className="hub-stage" data-testid="hub-scene" aria-labelledby="hub-title">
      <img
        className="hub-background"
        src={YOKO_PACK_ASSETS.hubBackground}
        alt="Incident Hub aboard Void-eager with a central command display and corridors leading deeper into the ship"
      />

      <div className="hub-location-tag hub-location-tag--left" aria-hidden="true">
        MAINTENANCE ACCESS
      </div>
      <div className="hub-location-tag hub-location-tag--right" aria-hidden="true">
        ENGINEERING ACCESS
      </div>

      <div className="hub-screen-interface">
        <header className="hub-screen-header">
          <span>INCIDENT HUB // ACTIVE INVESTIGATION</span>
          <strong>{theorySaved ? 'CASE REVIEWED' : 'SESSION OPEN'}</strong>
        </header>

        <div className="hub-screen-body">
          <p className="eyebrow">INCIDENT REVIEW</p>
          <h2 id="hub-title">
            {theorySaved
              ? 'Theory saved'
              : serialChecked
                ? 'Review the Coupler evidence'
                : storageLeadUnlocked
                  ? 'Storage lead available'
                  : 'Continue the Coupler case'}
          </h2>
          <p className="muted">
            {theorySaved
              ? (alertComplete ? 'End Session is available below.' : 'C-17 requires a response before this session ends.')
              : serialChecked
                ? 'Record a working theory in Case Review.'
                : storageLeadUnlocked
                  ? 'Follow the Storage B-04 lead in the bottom HUD.'
                  : 'Choose Workstation or Storage. Power is optional.'}
          </p>

          <div className="hub-thread-grid">
            <article className="hub-thread-card">
              <span>MAIN CASE // MAINTENANCE</span>
              <strong>{COUPLER.thread}</strong>
              <small>
                {serialChecked
                  ? 'SERIAL LOGGED'
                  : storageLeadUnlocked
                    ? 'STORAGE LEAD READY'
                    : recordOpened ? 'WORK ORDER OPEN' : 'WORK ORDER NOT YET OPEN'}
              </small>
              <div className="hub-coupler-navigation">
                <button className="console-choice" data-testid="open-coupler-thread" onClick={onCoupler}>
                  WORKSTATION
                </button>
                <button className="console-choice" data-testid="hub-visit-storage" onClick={onStorage}>
                  STORAGE B-04
                </button>
              </div>
            </article>

            <article className="hub-thread-card">
              <span>OPTIONAL // POWER LOG</span>
              <strong>{POWER_SPIKE.thread}</strong>
              <small>
                {powerReviewed
                  ? 'TIMELINE REVIEWED'
                  : 'EXTRA CONTEXT'}
              </small>
              <button className="console-choice" data-testid="open-power-thread" onClick={onPower}>
                {powerReviewed ? 'REVIEW POWER LOG' : 'VIEW POWER LOG'}
              </button>
            </article>
          </div>

          <div className="hub-case-actions">
            <div>
              <span>CASE REVIEW</span>
              <small>
                {!serialChecked
                  ? 'Compare the part in Storage first.'
                  : theorySaved
                    ? (alertComplete ? 'Finish or continue investigating.' : 'Complete C-17 to finish; other routes remain open.')
                    : 'You can now record your conclusion.'}
              </small>
            </div>

            {serialChecked && !theorySaved && (
              <button className="console-choice" data-testid="hub-open-case-review" onClick={onCaseReview}>
                CASE REVIEW
              </button>
            )}

            {theorySaved && !alertComplete && (
              <button className="console-choice hub-pending-alert" data-testid="hub-open-c17" onClick={onOpenAlert}>
                {alertPending ? 'OPEN C-17 ALERT' : 'REVIEW SHIP ALERT C-17'}
              </button>
            )}

            {theorySaved && alertComplete && (
              <button className="console-choice hub-end-session" data-testid="hub-end-session" onClick={onEndSession}>
                End Session
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
