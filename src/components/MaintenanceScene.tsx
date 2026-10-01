import { useEffect, useRef } from 'react'
import { COUPLER } from '../content/coupler'

type Props = {
  opened: boolean
  postInterruption: boolean
  restoreScrollOffset: number | null
  onScrollChange: (offset: number) => void
  onOpen: () => void
  onStorage: () => void
}

export function MaintenanceScene({
  opened,
  postInterruption,
  restoreScrollOffset,
  onScrollChange,
  onOpen,
  onStorage,
}: Props) {
  const order = COUPLER.workOrder
  const reportRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!opened || restoreScrollOffset === null || !reportRef.current) return
    reportRef.current.scrollTop = restoreScrollOffset
  }, [opened, restoreScrollOffset])

  return (
    <section className="scene-card reading-scene" data-testid="maintenance-scene" aria-labelledby="maintenance-title">
      <p className="eyebrow">MAINTENANCE // RECORD TERMINAL</p>
      <h2 id="maintenance-title">Stabilizer Service History</h2>
      <p className="thread-question">{COUPLER.thread}</p>

      {!opened ? (
        <button className="primary" data-testid="inspect-work-order" onClick={onOpen}>
          Open maintenance report
        </button>
      ) : (
        <article
          ref={reportRef}
          className="report-document"
          data-testid="maintenance-report"
          onScroll={(event) => onScrollChange(event.currentTarget.scrollTop)}
        >
          <header>
            <span>WORK ORDER {order.id}</span>
            <strong>{order.component}</strong>
          </header>

          <section>
            <h3>Service record</h3>
            <p>
              Routine stabilizer maintenance was logged twelve days before the cascade event.
              The work order records the coupler replacement as complete.
            </p>
          </section>

          <section>
            <h3>Recorded completion</h3>
            <p>Status: {order.status}</p>
            <p>Technician: {order.technician}</p>
            <p>Replacement serial: {order.replacementSerial}</p>
          </section>
          <section>
            <h3>Parts reference</h3>
            <p>Issued replacement serial: {order.replacementSerial}</p>
            <p>Source location: Storage B-04</p>
            <p>Physical installation verification: not attached to this work order.</p>
          </section>
        </article>
      )}

      {opened && postInterruption && (
        <button className="secondary" data-testid="go-storage" onClick={onStorage}>
          Trace replacement serial in Storage
        </button>
      )}
    </section>
  )
}
