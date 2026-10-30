import { COUPLER } from '../content/coupler'
import { YOKO_PACK_ASSETS } from '../content/yokoPackAssets'
import { evidenceCatalog } from '../game/evidence'
import type { InvestigationIntention } from '../game/types'

type Props = {
  observedEvidence: string[]
  activeIntention: InvestigationIntention | null
  comparisonSaved: boolean
  theorySaved: boolean
  alertComplete: boolean
  alertPending: boolean
  onOpenAlert: () => void
  onMaintenance: () => void
  onEngineering: () => void
  onCaseReview: () => void
  onEndSession: () => void
}

const focusNames: Record<InvestigationIntention, string> = {
  'check-completion': 'Check the completion record',
  'trace-part': 'Trace the issued part',
  'check-verification': 'Look for installation verification',
}

export function HubScene({
  observedEvidence,
  activeIntention,
  comparisonSaved,
  theorySaved,
  alertComplete,
  alertPending,
  onOpenAlert,
  onMaintenance,
  onEngineering,
  onCaseReview,
  onEndSession,
}: Props) {
  const caseSources = evidenceCatalog.filter(({ id }) => observedEvidence.includes(id))
  const caseReady = caseSources.some(({ id }) => id.startsWith('MAI_') || id.startsWith('STO_'))
  const recentSources = caseSources.slice(-2)

  return (
    <section className="hub-stage hub-stage--door-navigation" data-testid="hub-scene" aria-labelledby="hub-title">
      <img
        className="hub-background"
        src={YOKO_PACK_ASSETS.hubBackground}
        alt="Incident Hub on Void-eager, with the Maintenance corridor on the left, Engineering corridor on the right, and a central case computer"
      />

      <button
        type="button"
        className="hub-door hub-door--maintenance"
        data-testid="hub-maintenance-door"
        onClick={onMaintenance}
        aria-label="Enter the Maintenance Room through the left corridor"
      >
        <span className="hub-door__label">◀ MAINTENANCE</span>
      </button>
      <button
        type="button"
        className="hub-door hub-door--engineering"
        data-testid="hub-engineering-door"
        onClick={onEngineering}
        aria-label="Enter Engineering through the right corridor to inspect the optional Power Log"
      >
        <span className="hub-door__label">ENGINEERING ▶</span>
      </button>

      <div className="hub-screen-interface hub-screen-interface--caseboard" data-testid="hub-case-board">
        <header className="hub-screen-header">
          <span>INCIDENT HUB // CASE BOARD</span>
          <strong>{theorySaved ? 'THEORY SAVED' : 'CASE OPEN'}</strong>
        </header>
        <div className="hub-screen-body">
          <p className="eyebrow">INVESTIGATION OVERVIEW</p>
          <h2 id="hub-title">{COUPLER.thread}</h2>
          <div className="hub-caseboard-stats" aria-label="Case status">
            <span><strong>{String(caseSources.length).padStart(2, '0')}</strong> SOURCES</span>
            <span><strong>{comparisonSaved ? 'SAVED' : 'OPEN'}</strong> COMPARE</span>
            <span><strong>{alertComplete ? 'LOGGED' : alertPending ? 'PENDING' : 'OPEN'}</strong> C-17</span>
          </div>
          <div className="hub-caseboard-evidence" data-testid="hub-evidence-index">
            <strong>OBSERVED SOURCE INDEX</strong>
            {recentSources.length ? (
              recentSources.map((source) => <p key={source.id}>{source.label}</p>)
            ) : (
              <p>No case evidence inspected yet. Search Maintenance or Storage B-04.</p>
            )}
            {caseSources.length > 2 && <small>+{caseSources.length - 2} earlier sources in Case Review</small>}
            {activeIntention && <small data-testid="hub-current-focus">CURRENT FOCUS // {focusNames[activeIntention]}</small>}
          </div>
          <div className="hub-caseboard-actions" data-testid="hub-case-actions">
            {caseReady && (
              <button className="console-choice" type="button" data-testid="hub-open-case-review" onClick={onCaseReview}>
                {theorySaved ? 'REVISE THEORY' : 'CASE REVIEW'}
              </button>
            )}
            {theorySaved && !alertComplete && (
              <button className="console-choice hub-pending-alert" type="button" data-testid="hub-open-c17" onClick={onOpenAlert}>
                {alertPending ? 'OPEN C-17' : 'HANDLE C-17'}
              </button>
            )}
            {theorySaved && alertComplete && (
              <button className="console-choice hub-end-session" type="button" data-testid="hub-end-session" onClick={onEndSession}>
                END SESSION
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
