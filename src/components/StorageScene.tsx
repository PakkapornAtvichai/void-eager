import { useEffect, useState } from 'react'
import { COUPLER, STORAGE_COUPLER } from '../content/coupler'
import { YOKO_PACK_ASSETS } from '../content/yokoPackAssets'
import { ObjectiveTracker } from './ObjectiveTracker'
import { EvidenceModal } from './EvidenceModal'
import { storageObjective } from '../game/objectives'

type Props = {
  crateOpen: boolean
  inspected: boolean
  serialChecked: boolean
  completionObserved: boolean
  partsObserved: boolean
  compared: boolean
  onOpenCrate: () => void
  onInspect: () => void
  onCheckSerial: () => void
  onSaveComparison: () => void
  onRecheckWorkOrder: () => void
  onModalChange: (open: boolean) => void
  onBack: () => void
}

type Detail = 'crate' | 'coupler' | 'serial' | 'comparison'

export function StorageScene({
  crateOpen,
  inspected,
  serialChecked,
  completionObserved,
  partsObserved,
  compared,
  onOpenCrate,
  onInspect,
  onCheckSerial,
  onSaveComparison,
  onRecheckWorkOrder,
  onModalChange,
  onBack,
}: Props) {
  const [detail, setDetail] = useState<Detail | null>(null)
  const [hintOpen, setHintOpen] = useState(false)
  const workOrderSerialObserved = completionObserved || partsObserved
  const canCompare = serialChecked && workOrderSerialObserved
  const phase = !crateOpen ? 'closed' : serialChecked ? 'serial' : inspected ? 'coupler' : 'open'

  useEffect(() => {
    onModalChange(detail !== null || hintOpen)
    return () => onModalChange(false)
  }, [detail, hintOpen, onModalChange])

  return (
    <section className="storage-stage storage-stage--yoko" data-testid="storage-scene" aria-label="Storage B-04">
      <ObjectiveTracker objective={storageObjective(phase, canCompare)} onModalChange={setHintOpen} />

      <div className="storage-environment" data-testid="storage-environment" aria-hidden="true">
        <div className="storage-beam storage-beam--left" />
        <div className="storage-beam storage-beam--right" />
        <div className="storage-shelf storage-shelf--left">
          <span /><span /><span /><span /><span /><span />
        </div>
        <div className="storage-shelf storage-shelf--right">
          <span /><span /><span /><span /><span /><span />
        </div>
        <div className="storage-floor-grid" />
        <div className="storage-crate-stack storage-crate-stack--left"><i /><i /><i /></div>
        <div className="storage-crate-stack storage-crate-stack--right"><i /><i /></div>
      </div>

      <div className="storage-object-stage storage-object-stage--unobstructed" data-testid="storage-coupler-visual">
        {!crateOpen ? (
          <button
            type="button"
            className="storage-object-button"
            data-testid="storage-open-crate"
            onClick={() => {
              onOpenCrate()
              setDetail('crate')
            }}
          >
            <img src={YOKO_PACK_ASSETS.storageCrateClosed} alt="Closed crate labelled as containing a replacement Coupler" />
            <span>OPEN CRATE</span>
          </button>
        ) : (
          <>
            <div className="storage-object-button storage-object-button--display" aria-hidden="true">
              <img
                src={serialChecked
                  ? YOKO_PACK_ASSETS.storageSerialDetail
                  : inspected
                    ? YOKO_PACK_ASSETS.storageCouplerInspection
                    : YOKO_PACK_ASSETS.storageCrateOpen}
                alt=""
              />
            </div>
            <div className="storage-inspection-actions" aria-label="Inspect the replacement unit">
              <button
                type="button"
                data-testid="inspect-storage-coupler"
                onClick={() => {
                  onInspect()
                  setDetail('coupler')
                }}
              >
                {inspected ? 'REVIEW CONDITION' : 'INSPECT CONDITION'}
              </button>
              <button
                type="button"
                data-testid={serialChecked ? 'storage-review-serial' : 'check-storage-serial'}
                onClick={() => {
                  onCheckSerial()
                  setDetail('serial')
                }}
              >
                {serialChecked ? 'REVIEW SERIAL' : 'READ SERIAL'}
              </button>
              {canCompare && (
                <button
                  type="button"
                  className={compared ? 'is-compared' : ''}
                  data-testid="storage-compare-sources"
                  onClick={() => setDetail('comparison')}
                >
                  {compared ? 'REVIEW COMPARISON' : 'COMPARE SOURCES'}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <button type="button" className="storage-simple-exit navigation-button" data-testid="storage-back-maintenance" onClick={onBack}>
        ← MAINTENANCE
      </button>

      {detail === 'crate' && (
        <EvidenceModal title="Crate opened" kicker="STORAGE B-04 // PHYSICAL SOURCE" onClose={() => setDetail(null)} testId="storage-detail-dialog">
          <p>A crate labelled for a replacement Coupler is open in Storage B-04.</p>
          <p>You can inspect its condition and read its individual serial plate in either order.</p>
        </EvidenceModal>
      )}
      {detail === 'coupler' && (
        <EvidenceModal title="Replacement Coupler condition" kicker="STORAGE B-04 // PHYSICAL INSPECTION" onClose={() => setDetail(null)} testId="storage-detail-dialog">
          <div data-testid="storage-evidence" className="evidence-modal__finding">
            <strong>Physical observation recorded</strong>
            <p>UNIT CONDITION: UNUSED</p>
            <p>OBSERVED LOCATION: STORAGE B-04</p>
          </div>
          <p>This is an observation of the unit, not a conclusion about what happened in Maintenance.</p>
        </EvidenceModal>
      )}
      {detail === 'serial' && (
        <EvidenceModal title="Unit serial plate" kicker="STORAGE B-04 // IDENTIFYING MARKING" onClose={() => setDetail(null)} testId="storage-detail-dialog">
          <div data-testid="storage-evidence" className="evidence-modal__finding">
            <strong>Physical observation recorded</strong>
            <p>UNIT SERIAL: {STORAGE_COUPLER.serial}</p>
            <p>SOURCE: STORAGE B-04 PLATE</p>
          </div>
          <p>The serial identifies this particular unit, not an entire batch.</p>
          {!workOrderSerialObserved && <small>Work Order serial has not yet been inspected. You can revisit the Workstation.</small>}
        </EvidenceModal>
      )}
      {detail === 'comparison' && canCompare && (
        <EvidenceModal title="Compare two sources" kicker="CASE FILE // SOURCE CROSS-CHECK" onClose={() => setDetail(null)} testId="storage-comparison-dialog">
          <div className="source-comparison-grid" data-testid="serial-comparison">
            <section>
              <span>MAINTENANCE // WO-4471</span>
              <strong>RECORDED SERIAL</strong>
              <p>{COUPLER.workOrder.replacementSerial}</p>
              <small>{completionObserved ? 'Completion field: COUPLER REPLACED' : 'Completion field: not inspected'}</small>
              {partsObserved && <small>Parts field: installation verification not attached</small>}
            </section>
            <section>
              <span>STORAGE // B-04</span>
              <strong>PHYSICAL UNIT SERIAL</strong>
              <p>{STORAGE_COUPLER.serial}</p>
              <small>{inspected ? 'Condition observed: UNUSED' : 'Condition not yet inspected'}</small>
            </section>
          </div>
          <p>What does this comparison make you question?</p>
          <small>The recorded and physical serials identify the same individual unit. This does not automatically select a theory.</small>
          <div className="source-comparison-actions">
            <button
              type="button"
              className="primary"
              data-testid="save-comparison"
              disabled={compared}
              onClick={onSaveComparison}
            >
              {compared ? 'COMPARISON SAVED' : 'SAVE COMPARISON TO CASE'}
            </button>
            <button
              type="button"
              className="comparison-room-return"
              data-testid="storage-recheck-workorder"
              onClick={() => {
                setDetail(null)
                onRecheckWorkOrder()
              }}
            >
              RETURN TO MAINTENANCE
            </button>
          </div>
          {compared && <p role="status" data-testid="comparison-saved">Source pairing saved. You may continue investigating or file a working theory.</p>}
        </EvidenceModal>
      )}
    </section>
  )
}
