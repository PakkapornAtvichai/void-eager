import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { COUPLER } from '../content/coupler'
import { MAINTENANCE_ASSETS } from '../content/maintenanceAssets'
import type { InvestigationIntention, WorkOrderFieldId } from '../game/types'
import { EvidenceModal } from './EvidenceModal'

type Props = {
  opened: boolean
  restoreScrollOffset: number | null
  onScrollChange: (offset: number) => void
  onModalChange: (open: boolean) => void
  observedFields: WorkOrderFieldId[]
  activeIntention: InvestigationIntention | null
  storageLeadUnlocked: boolean
  onOpen: () => void
  onObserveField: (field: WorkOrderFieldId) => void
  onSetIntention: (intention: InvestigationIntention) => void
  onUnlockStorageLead: () => void
  onBack: () => void
}

const fieldNames: Record<WorkOrderFieldId, string> = {
  service: '01 // SERVICE RECORD',
  completion: '02 // RECORDED COMPLETION',
  parts: '03 // PARTS REFERENCE',
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
  storageLeadUnlocked,
  onOpen,
  onObserveField,
  onSetIntention,
  onUnlockStorageLead,
  onBack,
}: Props) {
  const order = COUPLER.workOrder
  const reportRef = useRef<HTMLElement>(null)
  const [selectedField, setSelectedField] = useState<WorkOrderFieldId | null>(null)
  const inspectedParts = observedFields.includes('parts')

  useEffect(() => {
    onModalChange(selectedField !== null)
    return () => onModalChange(false)
  }, [selectedField, onModalChange])

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

              {availableIntentions.length > 0 && (
                <div className="workorder-intentions" data-testid="workorder-intentions">
                  <strong>WHAT WILL YOU CHECK NEXT?</strong>
                  <div className="workorder-intention-choices">
                    {availableIntentions.map((intention) => (
                      <button
                        key={intention}
                        type="button"
                        className={activeIntention === intention ? 'is-selected' : ''}
                        data-testid={`choose-intention-${intention}`}
                        aria-pressed={activeIntention === intention}
                        onClick={() => onSetIntention(intention)}
                      >
                        {intentionLabels[intention]}
                      </button>
                    ))}
                  </div>
                  {activeIntention && (
                    <p className="workorder-active-intention" data-testid="active-investigation-focus">
                      CURRENT FOCUS // {intentionLabels[activeIntention]}
                    </p>
                  )}
                </div>
              )}
            </article>
          )}

          {opened && inspectedParts && (
            <button
              type="button"
              className={`console-subcommand ${storageLeadUnlocked ? 'is-complete' : 'is-new-action'}`}
              data-testid="unlock-storage-lead"
              onClick={onUnlockStorageLead}
              disabled={storageLeadUnlocked}
            >
              {storageLeadUnlocked ? 'LEAD SAVED // STORAGE B-04' : 'TRACE PART SOURCE // B-04'}
            </button>
          )}
        </div>
      </div>

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
