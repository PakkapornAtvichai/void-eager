import { useEffect, useState } from 'react'
import { COUPLER, STORAGE_COUPLER } from '../content/coupler'
import { YOKO_PACK_ASSETS } from '../content/yokoPackAssets'
import { ObjectiveTracker } from './ObjectiveTracker'
import { EvidenceModal } from './EvidenceModal'
import { storageObjective } from '../game/objectives'

type Props = {
  inspected: boolean
  serialChecked: boolean
  workOrderSerialObserved: boolean
  onInspect: () => void
  onCheckSerial: () => void
  onModalChange: (open: boolean) => void
  onBack: () => void
}

type Detail = 'crate' | 'coupler' | 'serial'

export function StorageScene({ inspected, serialChecked, workOrderSerialObserved, onInspect, onCheckSerial, onModalChange, onBack }: Props) {
  const [crateOpen, setCrateOpen] = useState(inspected || serialChecked)
  const [detail, setDetail] = useState<Detail | null>(null)
  const [hintOpen, setStorageHintOpen] = useState(false)

  useEffect(() => {
    onModalChange(detail !== null || hintOpen)
    return () => onModalChange(false)
  }, [detail, hintOpen, onModalChange])

  useEffect(() => {
    if (inspected || serialChecked) setCrateOpen(true)
  }, [inspected, serialChecked])

  const phase = serialChecked ? 'serial' : inspected ? 'coupler' : crateOpen ? 'open' : 'closed'

  return (
    <section className="storage-stage storage-stage--yoko" data-testid="storage-scene" aria-label="Storage B-04">
      <ObjectiveTracker objective={storageObjective(phase)} onModalChange={setStorageHintOpen} />

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
        {phase === 'closed' && (
          <button
            type="button"
            className="storage-object-button"
            data-testid="storage-open-crate"
            onClick={() => {
              setCrateOpen(true)
              setDetail('crate')
            }}
          >
            <img src={YOKO_PACK_ASSETS.storageCrateClosed} alt="Closed replacement-coupler crate" />
            <span>OPEN CRATE</span>
          </button>
        )}
        {phase === 'open' && (
          <button
            type="button"
            className="storage-object-button"
            data-testid="inspect-storage-coupler"
            onClick={() => {
              onInspect()
              setDetail('coupler')
            }}
          >
            <img src={YOKO_PACK_ASSETS.storageCrateOpen} alt="Replacement Coupler inside the opened crate" />
            <span>INSPECT COUPLER</span>
          </button>
        )}
        {phase === 'coupler' && (
          <button
            type="button"
            className="storage-object-button storage-object-button--coupler"
            data-testid="check-storage-serial"
            onClick={() => {
              onCheckSerial()
              setDetail('serial')
            }}
          >
            <img src={YOKO_PACK_ASSETS.storageCouplerInspection} alt="Close-up of replacement Guidance Stabilizer Coupler" />
            <span>FIND SERIAL</span>
          </button>
        )}
        {phase === 'serial' && (
          <div className="storage-serial-focus" data-testid="storage-serial-visual">
            <button
              type="button"
              className="storage-serial-review"
              data-testid="storage-review-serial"
              onClick={() => setDetail('serial')}
              aria-label="Review the serial comparison"
            >
              <img src={YOKO_PACK_ASSETS.storageSerialDetail} alt={`Serial plate showing ${STORAGE_COUPLER.serial}`} />
              <span>REVIEW SERIAL // {STORAGE_COUPLER.serial}</span>
            </button>
          </div>
        )}
      </div>

      <button type="button" className="storage-simple-exit navigation-button" data-testid="storage-back-hub" onClick={onBack}>
        ← INCIDENT HUB
      </button>
      <div className="storage-scene-label" aria-hidden="true">STORAGE B-04 // PARTS DEPOT</div>

      {detail === 'crate' && (
        <EvidenceModal title="Crate opened" kicker="STORAGE B-04" onClose={() => setDetail(null)} testId="storage-detail-dialog">
          <p>A replacement Coupler is inside this crate.</p>
          <p>Inspect the component to check its condition.</p>
        </EvidenceModal>
      )}
      {detail === 'coupler' && (
        <EvidenceModal title="Replacement Coupler" kicker="PHYSICAL INSPECTION" onClose={() => setDetail(null)} testId="storage-detail-dialog">
          <div data-testid="storage-evidence" className="evidence-modal__finding">
            <strong>Observation recorded</strong>
            <p>The replacement Coupler is unused and still in Storage.</p>
          </div>
          <p>Check its serial plate to identify this specific part.</p>
        </EvidenceModal>
      )}
      {detail === 'serial' && (
        <EvidenceModal title="Serial Plate" kicker="STORAGE B-04 // PHYSICAL EVIDENCE" onClose={() => setDetail(null)} testId="storage-detail-dialog">
          <div className="evidence-modal__finding" data-testid="storage-evidence">
            <strong>Observation recorded</strong>
            <p>The replacement Coupler is still in Storage.</p>
          </div>
          <div className="serial-comparison-modal" data-testid="serial-comparison">
            <div><span>COUPLER PLATE</span><strong>{STORAGE_COUPLER.serial}</strong></div>
            <div><span>WORK ORDER</span><strong>{workOrderSerialObserved ? COUPLER.workOrder.replacementSerial : 'NOT YET INSPECTED'}</strong></div>
          </div>
          <p>{workOrderSerialObserved ? 'These are two different sources. Decide what to compare during your investigation.' : 'The Work Order is a separate source. Inspect it to compare this part with the recorded claim.'}</p>
        </EvidenceModal>
      )}
    </section>
  )
}
