import { COUPLER } from '../content/coupler'
import type { QuickPin } from '../game/types'
import { ResumeCue } from './ResumeCue'

type Props = {
  opened: boolean
  resumed: boolean
  quickPin: QuickPin | null
  onOpen: () => void
}

export function MaintenanceScene({ opened, resumed, quickPin, onOpen }: Props) {
  const order = COUPLER.workOrder

  return (
    <section className="scene-card" aria-labelledby="maintenance-title">
      <p className="eyebrow">MAINTENANCE // RECORD TERMINAL</p>
      <h2 id="maintenance-title">Stabilizer Service History</h2>
      <p className="muted">Review the latest coupler work order.</p>
      {resumed && <ResumeCue quickPin={quickPin} />}
      <div className="work-order">
        <span>WORK ORDER {order.id}</span>
        <strong>{order.component}</strong>
        <span>Status: {order.status}</span>
        <span>Technician: {order.technician}</span>
      </div>
      <button className="primary" onClick={onOpen} disabled={opened}>
        {opened ? 'Record logged' : 'Inspect work order'}
      </button>
    </section>
  )
}
