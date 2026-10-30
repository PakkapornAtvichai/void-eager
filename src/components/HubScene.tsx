import { COUPLER } from '../content/coupler'
import { POWER_SPIKE } from '../content/power'
import { YOKO_PACK_ASSETS } from '../content/yokoPackAssets'

type Props = {
  storageLeadUnlocked: boolean
  recordOpened: boolean
  serialChecked: boolean
  powerReviewed: boolean
  theorySaved: boolean
  caseEvidenceAvailable: boolean
  comparisonSaved: boolean
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
  caseEvidenceAvailable,
  comparisonSaved,
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
              ? 'Working theory saved'
              : caseEvidenceAvailable
                ? 'Review observed evidence'
                : storageLeadUnlocked
                  ? 'Storage lead available'
                  : 'Continue the Coupler case'}
          </h2>
          <p className="muted">
            {theorySaved
              ? (alertComplete ? 'You may revise your theory or end the session.' : 'You may revise your theory. C-17 still needs a response.')
              : caseEvidenceAvailable
                ? 'A provisional theory can be saved now or after investigating further.'
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
                {!caseEvidenceAvailable
                  ? 'Inspect any Coupler source to start a provisional theory.'
                  : theorySaved
                    ? (alertComplete ? 'Revise your theory or finish the session.' : 'Revise your theory; C-17 remains outstanding.')
                    : comparisonSaved
                      ? 'A source comparison is saved. Record a working theory if ready.'
                      : 'Choose what you currently believe; you can revise it later.'}
              </small>
            </div>

            <div className="hub-case-buttons">
              {caseEvidenceAvailable && (
                <button className="console-choice" data-testid="hub-open-case-review" onClick={onCaseReview}>
                  {theorySaved ? 'REVISE THEORY' : 'CASE REVIEW'}
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
      </div>
    </section>
  )
}
