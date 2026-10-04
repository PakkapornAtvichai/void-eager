import { useEffect, useState } from 'react'
import { COUPLER, STORAGE_COUPLER } from '../content/coupler'
import { YOKO_PACK_ASSETS } from '../content/yokoPackAssets'

type Props = {
  inspected: boolean
  serialChecked: boolean
  onInspect: () => void
  onCheckSerial: () => void
  onBack: () => void
}

export function StorageScene({
  inspected,
  serialChecked,
  onInspect,
  onCheckSerial,
  onBack,
}: Props) {
  const [crateOpen, setCrateOpen] = useState(inspected || serialChecked)

  useEffect(() => {
    if (inspected || serialChecked) setCrateOpen(true)
  }, [inspected, serialChecked])

  const phase = serialChecked
    ? 'serial'
    : inspected
      ? 'coupler'
      : crateOpen
        ? 'open'
        : 'closed'

  return (
    <section className="storage-stage storage-stage--yoko" data-testid="storage-scene" aria-labelledby="storage-title">
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

      <div className="storage-object-stage" data-testid="storage-coupler-visual">
        {phase === 'closed' && (
          <button
            type="button"
            className="storage-object-button"
            data-testid="storage-open-crate"
            onClick={() => setCrateOpen(true)}
          >
            <img src={YOKO_PACK_ASSETS.storageCrateClosed} alt="Closed replacement coupler storage crate" />
            <span>OPEN REPLACEMENT CRATE</span>
          </button>
        )}

        {phase === 'open' && (
          <button
            type="button"
            className="storage-object-button"
            data-testid="inspect-storage-coupler"
            onClick={onInspect}
          >
            <img src={YOKO_PACK_ASSETS.storageCrateOpen} alt="Open storage crate with a replacement coupler inside" />
            <span>INSPECT COUPLER</span>
          </button>
        )}

        {phase === 'coupler' && (
          <button
            type="button"
            className="storage-object-button storage-object-button--coupler"
            data-testid="check-storage-serial"
            onClick={onCheckSerial}
          >
            <img src={YOKO_PACK_ASSETS.storageCouplerInspection} alt="Replacement guidance stabilizer coupler ready for close inspection" />
            <span>LOCATE SERIAL PLATE</span>
          </button>
        )}

        {phase === 'serial' && (
          <div className="storage-serial-focus" data-testid="storage-serial-visual">
            <img src={YOKO_PACK_ASSETS.storageSerialDetail} alt="Serial plate on the replacement coupler showing GSC-8842-A" />
            <span>OBSERVED SERIAL // {STORAGE_COUPLER.serial}</span>
          </div>
        )}
      </div>

      <div className="storage-inspection-panel">
        <header className="stage-console-header">
          <span>STORAGE // PARTS DEPOT</span>
          <strong>B-04</strong>
        </header>

        <div className="stage-console-body">
          <p className="eyebrow">PHYSICAL INSPECTION</p>
          <h2 id="storage-title">
            {phase === 'closed' && 'Replacement Parts Crate'}
            {phase === 'open' && 'Crate Opened'}
            {phase === 'coupler' && 'Replacement Coupler'}
            {phase === 'serial' && 'Serial Plate'}
          </h2>

          {phase === 'closed' && (
            <p className="muted">A replacement-parts crate is stored at B-04. Open it to inspect the contents.</p>
          )}

          {phase === 'open' && (
            <div className="part-card storage-part-card">
              <span>Contents: Guidance Stabilizer Coupler</span>
              <strong>Condition: New / unused</strong>
              <span>The replacement part is still physically inside the crate.</span>
            </div>
          )}

          {(phase === 'coupler' || phase === 'serial') && (
            <div className="evidence-note" data-testid="storage-evidence">
              <strong>Evidence logged</strong>
              <span>The replacement coupler is still physically present in Storage.</span>
            </div>
          )}

          {phase === 'coupler' && (
            <p className="muted">Inspect the component itself to locate its serial plate.</p>
          )}

          {phase === 'serial' && (
            <div className="comparison-card" data-testid="serial-comparison">
              <span>Observed on coupler: {STORAGE_COUPLER.serial}</span>
              <span>Replacement serial in work order: {COUPLER.workOrder.replacementSerial}</span>
              <small>Return to the Incident Hub when you are ready to decide what to do next.</small>
            </div>
          )}

          <div className="storage-actions">
            <button className="navigation-button nav-primary" data-testid="storage-back-hub" onClick={onBack}>
              ← NAV // INCIDENT HUB
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
