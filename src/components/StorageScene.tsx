import { COUPLER, STORAGE_COUPLER } from '../content/coupler'

type Props = {
  inspected: boolean
  serialChecked: boolean
  onInspect: () => void
  onCheckSerial: () => void
  onDeduction: () => void
  onBack: () => void
}

export function StorageScene({
  inspected,
  serialChecked,
  onInspect,
  onCheckSerial,
  onDeduction,
  onBack,
}: Props) {
  return (
    <section className="storage-stage" data-testid="storage-scene" aria-labelledby="storage-title">
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

        <div className="coupler-pedestal" data-testid="storage-coupler-visual">
          <div className="coupler-crate">
            <div className="coupler-ring">
              <i /><i /><i /><i />
            </div>
            <div className="coupler-core" />
          </div>
        </div>
      </div>

      <div className="storage-inspection-panel">
        <header className="stage-console-header">
          <span>STORAGE // PARTS DEPOT</span>
          <strong>B-04</strong>
        </header>
        <div className="stage-console-body">
          <p className="eyebrow">PHYSICAL INSPECTION</p>
          <h2 id="storage-title">Replacement Coupler Crate</h2>
          <p className="muted">Cross-check the physical part against the Maintenance work order.</p>

          <div className="part-card storage-part-card">
            <span>Component: {STORAGE_COUPLER.component}</span>
            <strong>Serial: {STORAGE_COUPLER.serial}</strong>
            <span>Condition: New / unused</span>
          </div>

          {!inspected ? (
            <button className="primary" data-testid="inspect-storage-coupler" onClick={onInspect}>
              Inspect replacement coupler
            </button>
          ) : (
            <div className="evidence-note" data-testid="storage-evidence">
              <strong>Evidence logged</strong>
              <span>The replacement coupler is still physically present in Storage.</span>
            </div>
          )}

          {inspected && !serialChecked && (
            <button className="secondary" data-testid="check-storage-serial" onClick={onCheckSerial}>
              Compare serial with work order
            </button>
          )}

          {serialChecked && (
            <div className="comparison-card" data-testid="serial-comparison">
              <span>Storage serial: {STORAGE_COUPLER.serial}</span>
              <span>Work order replacement serial: {COUPLER.workOrder.replacementSerial}</span>
              <strong>Serials match.</strong>
            </div>
          )}

          <div className="storage-actions">
            <button className="navigation-button nav-primary" data-testid="storage-back-hub" onClick={onBack}>
              ← NAV // INCIDENT BOARD
            </button>
            {serialChecked && (
              <button className="primary" data-testid="open-deduction" onClick={onDeduction}>
                Review current theory
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
