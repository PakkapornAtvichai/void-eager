import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { COUPLER } from '../content/coupler'
import { MAINTENANCE_ASSETS } from '../content/maintenanceAssets'
import type { InvestigationIntention, VerificationNextStep, WorkOrderFieldId } from '../game/types'
import { EvidenceModal } from './EvidenceModal'

type Props = {
  opened: boolean
  restoreScrollOffset: number | null
  onScrollChange: (offset: number) => void
  onModalChange: (open: boolean) => void
  observedFields: WorkOrderFieldId[]
  activeIntention: InvestigationIntention | null
  verificationNextStep: VerificationNextStep | null
  resumedAfterAlert: boolean
  storageLeadUnlocked: boolean
  onOpen: () => void
  onObserveField: (field: WorkOrderFieldId) => void
  onSetIntention: (intention: InvestigationIntention) => void
  onPrepareCheck: (nextStep: VerificationNextStep) => void
  onUnlockStorageLead: () => void
  onBack: () => void
}

const fieldNames: Record<WorkOrderFieldId, string> = {
  service: '01 // SERVICE RECORD',
  completion: '02 // RECORDED COMPLETION',
  parts: '03 // PARTS REFERENCE',
}
const verificationLabels: Record<VerificationNextStep, string> = {
  'review-completion': 'Re-read the recorded completion',
  'trace-issued-unit': 'Trace the issued unit to Storage B-04',
  'check-installation': 'Look for installation verification',
}
const intentionLabels: Record<InvestigationIntention, string> = {
  'check-completion': 'Check the completion record',
  'trace-part': 'Trace the issued part',
  'check-verification': 'Look for installation verification',
}

export function WorkstationFocusScene({
  opened,
  restoreScrollOffset,
  onScrollChange,
  onModalChange,
  observedFields,
  activeIntention,
  verificationNextStep,
  resumedAfterAlert,
  storageLeadUnlocked,
  onOpen,
  onObserveField,
  onSetIntention,
  onPrepareCheck,
  onUnlockStorageLead,
  onBack,
}: Props) {
  const order = COUPLER.workOrder
  const reportRef = useRef<HTMLElement>(null)
  const [selectedField, setSelectedField] = useState<WorkOrderFieldId | null>(null)
  const [checkOpen, setCheckOpen] = useState(false)
  const [nextStepChoice, setNextStepChoice] = useState<VerificationNextStep | null>(null)
  const inspectedParts = observedFields.includes('parts')

  useEffect(() => {
    onModalChange(selectedField !== null || checkOpen)
    return () => onModalChange(false)
  }, [selectedField, checkOpen, onModalChange])

  useEffect(() => {
    if (!opened || restoreScrollOffset === null || !reportRef.current) return
    reportRef.current.scrollTop = restoreScrollOffset
  }, [opened, restoreScrollOffset])

  const inspect = (field: WorkOrderFieldId) => {
    onObserveField(field)
    setSelectedField(field)
  }

  const availableIntentions: InvestigationIntention[] = [
    ...(observedFields.includes('completion') ? ['check-completion' as const] : []),
    ...(inspectedParts ? ['trace-part' as const, 'check-verification' as const] : []),
  ]

  const verificationChoices: VerificationNextStep[] = [
    ...(observedFields.includes('completion') ? ['review-completion' as const] : []),
    ...(inspectedParts ? ['trace-issued-unit' as const, 'check-installation' as const] : []),
  ]

  return (
    <section
      className="maintenance-stage workstation-stage"
      data-testid="workstation-focus"
      aria-label="Focused view of Glint's workstation"
    >
      <div className="maintenance-canvas">
        <img
          className="maintenance-layer maintenance-layer--base"
          src={MAINTENANCE_ASSETS.focusedWorkstation}
          alt="Glint's maintenance workstation"
        />
        <img className="maintenance-layer" src={MAINTENANCE_ASSETS.workstationNavigation} alt="" aria-hidden="true" />
        <img
          className="maintenance-layer"
          src={MAINTENANCE_ASSETS.workstationPrimary}
          alt=""
          aria-hidden="true"
          data-testid="workstation-primary-panel"
        />
        <img className="maintenance-layer" src={MAINTENANCE_ASSETS.workstationTechnical} alt="" aria-hidden="true" />

        <div className="console-screen console-screen--nav" aria-hidden="true">
          <div className="console-title"><span>GLINT // LOCAL</span><b>READ ONLY</b></div>
          <div className="console-menu console-menu--local">
            <span>MAINTENANCE TERMINAL</span>
            <span>RECORD // {order.id}</span>
            <span>THREE SOURCE FIELDS</span>
            <span>USE THE MAIN MONITOR</span>
          </div>
          <div className="console-bars">
            <i style={{ '--level': '78%' } as CSSProperties} />
            <i style={{ '--level': '46%' } as CSSProperties} />
            <i style={{ '--level': '63%' } as CSSProperties} />
          </div>
        </div>

        <div className="console-screen console-screen--technical" aria-hidden="true">
          <div className="console-title"><span>GSC-04</span><b>LINK</b></div>
          <dl className="tech-readout">
            <div><dt>ORDER</dt><dd>{order.id}</dd></div>
            <div><dt>TECH</dt><dd>{order.technician}</dd></div>
            <div><dt>PART</dt><dd>{inspectedParts ? order.replacementSerial : 'SEE WO-4471'}</dd></div>
          </dl>
          <div className="signal-grid"><span /><span /><span /><span /><span /><span /></div>
        </div>

        <button
          type="button"
          className="workstation-back navigation-button"
          data-testid="back-to-maintenance"
          onClick={onBack}
        >
          ← NAV // ROOM
        </button>

        <div className="workstation-report-slot">
          <div className="console-title console-title--primary">
            <span>{opened ? 'WORK ORDER // SELECT A SECTION' : 'MAINTENANCE RECORD'}</span>
            <b>WO//{order.id}</b>
          </div>

          {opened && availableIntentions.length > 0 && (
            <div className="workorder-focus-toolbar" data-testid="workorder-intentions">
              <label htmlFor="workstation-next-focus">NEXT CHECK</label>
              <select
                id="workstation-next-focus"
                data-testid="workstation-focus-select"
                value={activeIntention && availableIntentions.includes(activeIntention) ? activeIntention : ''}
                onChange={(event) => {
                  const choice = event.currentTarget.value as InvestigationIntention
                  if (availableIntentions.includes(choice)) onSetIntention(choice)
                }}
              >
                <option value="" disabled>Choose investigation focus...</option>
                {availableIntentions.map((intention) => (
                  <option key={intention} value={intention}>{intentionLabels[intention]}</option>
                ))}
              </select>
              {activeIntention && !verificationNextStep && (
                <button
                  type="button"
                  className="console-subcommand workorder-prepare-check"
                  data-testid="workstation-prepare-check"
                  onClick={() => {
                    setNextStepChoice(null)
                    setCheckOpen(true)
                  }}
                >
                  PREPARE CHECK
                </button>
              )}
              {inspectedParts && (
                <button
                  type="button"
                  className="console-subcommand workorder-save-lead"
                  data-testid="unlock-storage-lead"
                  onClick={onUnlockStorageLead}
                  disabled={storageLeadUnlocked}
                  title="Save the Storage B-04 location as a lead; travel via the Maintenance door"
                >
                  {storageLeadUnlocked ? 'B-04 LEAD SAVED' : 'SAVE B-04 LEAD'}
                </button>
              )}
            </div>
          )}

          {verificationNextStep && (
            <div className="workorder-unfinished-check" data-testid="unfinished-verification-check">
              <strong>{resumedAfterAlert ? 'CHECK RESUMED' : 'CHECK IN PROGRESS'}</strong>
              <span>{verificationLabels[verificationNextStep]}</span>
            </div>
          )}

          {!opened ? (
            <button
              type="button"
              className="console-command"
              data-testid="inspect-work-order"
              onClick={onOpen}
            >
              <span>ACCESS RECORD</span>
              <small>{order.component}</small>
            </button>
          ) : (
            <article
              ref={reportRef}
              className="workstation-report workorder-interactive-report"
              data-testid="workstation-report"
              onScroll={(event) => onScrollChange(event.currentTarget.scrollTop)}
            >
              <header>
                <span>WORK ORDER {order.id}</span>
                <strong>{order.component}</strong>
              </header>

              {(Object.keys(fieldNames) as WorkOrderFieldId[]).map((field) => (
                <button
                  key={field}
                  type="button"
                  className={`workorder-field-button ${observedFields.includes(field) ? 'is-observed' : ''}`}
                  data-testid={`inspect-wo-${field}`}
                  onClick={() => inspect(field)}
                >
                  <span>{fieldNames[field]}</span>
                  <small>{observedFields.includes(field) ? 'REVIEW FIELD' : 'INSPECT FIELD'}</small>
                </button>
              ))}

            </article>
          )}

        </div>
      </div>

      {checkOpen && (
        <EvidenceModal
          title="Prepare a source check"
          kicker="WORKSTATION // VERIFICATION WORKSHEET"
          testId="verification-worksheet"
          onClose={() => setCheckOpen(false)}
        >
          <div className="verification-worksheet-body">
            <p>YOUR FOCUS // <strong>{activeIntention ? intentionLabels[activeIntention] : 'not selected'}</strong></p>
            <p><strong>Step 1 of 2:</strong> Choose the source to follow next. Your choice is not graded.</p>
            <fieldset className="verification-next-choices" data-testid="verification-next-choices">
              <legend>Which source will you follow up next?</legend>
              {verificationChoices.map((choice) => (
                <label key={choice}>
                  <input
                    type="radio"
                    name="verification-next-step"
                    checked={nextStepChoice === choice}
                    onChange={() => setNextStepChoice(choice)}
                  />
                  {verificationLabels[choice]}
                </label>
              ))}
            </fieldset>
            <p className="verification-worksheet-note">This check stays open until you follow up the source.</p>
            <button
              type="button"
              className="primary verification-continue-button"
              data-testid="continue-verification"
              disabled={!nextStepChoice}
              onClick={() => {
                if (!nextStepChoice) return
                onPrepareCheck(nextStepChoice)
                setCheckOpen(false)
              }}
            >
              KEEP THIS CHECK OPEN
            </button>
          </div>
        </EvidenceModal>
      )}

      {selectedField && (
        <EvidenceModal
          title={fieldNames[selectedField]}
          kicker={`WO-${order.id} // SOURCE RECORD`}
          testId="workorder-field-dialog"
          onClose={() => setSelectedField(null)}
        >
          {selectedField === 'service' && (
            <p>Routine stabilizer maintenance was logged twelve days before the cascade.</p>
          )}
          {selectedField === 'completion' && (
            <div className="workorder-fact-list">
              <p>STATUS: {order.status}</p>
              <p>TECHNICIAN: {order.technician}</p>
              <p>REPLACEMENT SERIAL: {order.replacementSerial}</p>
            </div>
          )}
          {selectedField === 'parts' && (
            <div className="workorder-fact-list">
              <p>ISSUED SERIAL: {order.replacementSerial}</p>
              <p>SOURCE: STORAGE B-04</p>
              <p>INSTALL VERIFY: NOT ATTACHED</p>
            </div>
          )}
        </EvidenceModal>
      )}
    </section>
  )
}
