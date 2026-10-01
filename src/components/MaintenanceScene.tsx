import { COUPLER } from '../content/coupler'
import type { QuickPin } from '../game/types'
import { ResumeCue } from './ResumeCue'

type Props = {
  opened: boolean
  resumed: boolean
  quickPin: QuickPin | null
  onOpen: () => void
  onStorage: () => void
}

export function MaintenanceScene({ opened, resumed, quickPin, onOpen, onStorage }: Props) {
  const order = COUPLER.workOrder

  return (
    <section className="scene-card" data-testid="maintenance-scene" aria-labelledby="maintenance-title">
      <p className="eyebrow">MAINTENANCE // RECORD TERMINAL</p>
      <h2 id="maintenance-title">Stabilizer Service History</h2>
      <p className="muted">Review the latest coupler work order.</p>
      {resumed && <ResumeCue quickPin={quickPin} />}
      <div className="work-order" data-testid="maintenance-work-order">
        <span>WORK ORDER {order.id}</span>
        <strong>{order.component}</strong>
        <span>Status: {order.status}</span>
        <span>Technician: {order.technician}</span>
        <span>Replacement serial: {order.replacementSerial}</span>
      </div>
      <button className="primary" data-testid="inspect-work-order" onClick={onOpen} disabled={opened}>
        {opened ? 'Record logged' : 'Inspect work order'}
      </button>
      {resumed && (
        <button className="secondary" data-testid="go-storage" onClick={onStorage}>
          Cross-check replacement part in Storage
        </button>
      )}
    </section>
  )
}
