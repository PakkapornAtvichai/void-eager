import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { COUPLER } from '../content/coupler'
import { MAINTENANCE_ASSETS } from '../content/maintenanceAssets'

type Props = {
  opened: boolean
  postInterruption: boolean
  restoreScrollOffset: number | null
  onScrollChange: (offset: number) => void
  storageLeadUnlocked: boolean
  onOpen: () => void
  onUnlockStorageLead: () => void
  onBack: () => void
}

export function WorkstationFocusScene({
  opened,
  postInterruption,
  restoreScrollOffset,
  onScrollChange,
  storageLeadUnlocked,
  onOpen,
  onUnlockStorageLead,
  onBack,
}: Props) {
  const order = COUPLER.workOrder
  const reportRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!opened || restoreScrollOffset === null || !reportRef.current) return
    reportRef.current.scrollTop = restoreScrollOffset
  }, [opened, restoreScrollOffset])

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
          <div className="console-title">
            <span>MNT.SYS</span>
            <b>ONLINE</b>
          </div>
          <div className="console-menu">
            <span className="active">WORK ORDERS</span>
            <span>DIAGNOSTICS</span>
            <span>PARTS TRACE</span>
            <span>SERVICE CACHE</span>
          </div>
          <div className="console-bars">
            <i style={{ '--level': '78%' } as CSSProperties} />
            <i style={{ '--level': '46%' } as CSSProperties} />
            <i style={{ '--level': '63%' } as CSSProperties} />
          </div>
        </div>

        <div className="console-screen console-screen--technical" aria-hidden="true">
          <div className="console-title">
            <span>GSC-04</span>
            <b>LINK</b>
          </div>
          <dl className="tech-readout">
            <div><dt>ORDER</dt><dd>{order.id}</dd></div>
            <div><dt>TECH</dt><dd>{order.technician}</dd></div>
            <div><dt>SERIAL</dt><dd>{order.replacementSerial}</dd></div>
          </dl>
          <div className="signal-grid">
            <span /><span /><span /><span /><span /><span />
          </div>
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
            <span>MAINTENANCE RECORD</span>
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
              className="workstation-report"
              data-testid="workstation-report"
              onScroll={(event) => onScrollChange(event.currentTarget.scrollTop)}
            >
              <header>
                <span>WORK ORDER {order.id}</span>
                <strong>{order.component}</strong>
              </header>

              <section>
                <h3>01 // SERVICE RECORD</h3>
                <p>
                  Routine stabilizer maintenance was logged twelve days before the cascade event.
                  The work order records the coupler replacement as complete.
                </p>
              </section>

              <section>
                <h3>02 // RECORDED COMPLETION</h3>
                <p>STATUS ........ {order.status}</p>
                <p>TECHNICIAN .... {order.technician}</p>
                <p>REPL. SERIAL .. {order.replacementSerial}</p>
              </section>

              <section>
                <h3>03 // PARTS REFERENCE</h3>
                <p>ISSUED SERIAL . {order.replacementSerial}</p>
                <p>SOURCE ........ STORAGE B-04</p>
                <p>INSTALL VERIFY. NOT ATTACHED</p>
                <p className="workstation-inquiry">INVESTIGATOR'S QUESTION // The record claims completion, but where is the installation proof?</p>
              </section>
            </article>
          )}

          {opened && postInterruption && (
            <button
              type="button"
              className={`console-subcommand ${storageLeadUnlocked ? 'is-complete' : 'is-new-action'}`}
              data-testid="unlock-storage-lead"
              onClick={onUnlockStorageLead}
              disabled={storageLeadUnlocked}
            >
              {storageLeadUnlocked ? 'LEAD ADDED // STORAGE B-04' : 'TRACE SERIAL → STORAGE'}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
