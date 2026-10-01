import { COUPLER, STORAGE_COUPLER } from '../content/coupler'

type Props = {
  inspected: boolean
  serialChecked: boolean
  onInspect: () => void
  onCheckSerial: () => void
  onDeduction: () => void
}

export function StorageScene({
  inspected,
  serialChecked,
  onInspect,
  onCheckSerial,
  onDeduction,
}: Props) {
  return (
    <section className="scene-card" data-testid="storage-scene" aria-labelledby="storage-title">
      <p className="eyebrow">STORAGE // PARTS DEPOT</p>
      <h2 id="storage-title">Replacement Coupler Crate</h2>
      <p className="muted">Cross-check the physical part against the Maintenance work order.</p>
      <div className="part-card">
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
          <strong>Evidence logged:</strong>
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

      {serialChecked && (
        <button className="primary" data-testid="open-deduction" onClick={onDeduction}>
          Review conclusion
        </button>
      )}
    </section>
  )
}
