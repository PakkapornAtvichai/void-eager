import { COUPLER } from '../content/coupler'
import { POWER_SPIKE } from '../content/power'
import { YOKO_PACK_ASSETS } from '../content/yokoPackAssets'

type Props = {
  storageLeadUnlocked: boolean
  serialChecked: boolean
  powerReviewed: boolean
  theorySaved: boolean
  onCoupler: () => void
  onPower: () => void
  onCaseReview: () => void
  onEndSession: () => void
}

export function HubScene({
  storageLeadUnlocked,
  serialChecked,
  powerReviewed,
  theorySaved,
  onCoupler,
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
          <p className="eyebrow">INVESTIGATION HOME</p>
          <h2 id="hub-title">Choose where to work next</h2>
          <p className="muted">
            You traveled here from Maintenance. Continue the Coupler case or inspect the optional Power timeline. Follow Storage leads from the bottom rail.
          </p>

          <div className="hub-thread-grid">
            <article className="hub-thread-card">
              <span>CASE THREAD // MAINTENANCE</span>
              <strong>{COUPLER.thread}</strong>
              <small>
                {serialChecked
                  ? 'STATUS // SERIAL VERIFIED'
                  : storageLeadUnlocked
                    ? 'STATUS // STORAGE LEAD AVAILABLE'
                    : 'STATUS // WORKSTATION RECORD OPEN'}
              </small>
              <button className="console-choice" data-testid="open-coupler-thread" onClick={onCoupler}>
                Return to Coupler / Workstation
              </button>
            </article>

            <article className="hub-thread-card">
              <span>CONTEXT THREAD // ENGINEERING</span>
              <strong>{POWER_SPIKE.thread}</strong>
              <small>
                {powerReviewed
                  ? 'STATUS // TIMELINE REVIEWED'
                  : 'OPTIONAL // RECONSTRUCT INCIDENT TIMELINE'}
              </small>
              <button className="console-choice" data-testid="open-power-thread" onClick={onPower}>
                {powerReviewed ? 'Review Power Timeline Again' : 'Inspect Power Timeline'}
              </button>
            </article>
          </div>

          <div className="hub-case-actions">
            <div>
              <span>CASE REVIEW</span>
              <small>
                {!serialChecked
                  ? 'Verify the Storage serial before filing a theory.'
                  : theorySaved
                    ? 'Theory saved. You may keep investigating or close the session.'
                    : 'Enough Coupler evidence is available to file a working theory.'}
              </small>
            </div>

            {serialChecked && !theorySaved && (
              <button className="console-choice" data-testid="hub-open-case-review" onClick={onCaseReview}>
                Open Case Review
              </button>
            )}

            {theorySaved && (
              <button className="console-choice hub-end-session" data-testid="hub-end-session" onClick={onEndSession}>
                End Investigation Session
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
