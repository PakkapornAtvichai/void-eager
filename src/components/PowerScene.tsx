import { POWER_SPIKE } from '../content/power'

type Props = {
  spikeFound: boolean
  protectionFound: boolean
  onInspectSpike: () => void
  onInspectProtection: () => void
  onBack: () => void
}

export function PowerScene({ spikeFound, protectionFound, onInspectSpike, onInspectProtection, onBack }: Props) {
  return (
    <section className="stage-console-scene power-system-scene" data-testid="power-scene" aria-labelledby="power-title">
      <div className="engineering-grid-backdrop" aria-hidden="true" />
      <div className="stage-console-panel power-console-panel">
        <header className="stage-console-header">
          <span>ENGINEERING // POWER LOG</span>
          <strong>21:11—21:12</strong>
        </header>
        <div className="stage-console-body">
          <p className="eyebrow">ANOMALY WINDOW</p>
          <h2 id="power-title">21:11 power anomaly</h2>
          <p className="thread-question">{POWER_SPIKE.thread}</p>

          <div className="power-timeline" aria-label="Power anomaly timeline">
            <div className={spikeFound ? 'timeline-node is-active' : 'timeline-node'}>
              <span>21:11</span><i /><strong>{spikeFound ? 'POWER SPIKE' : 'UNREAD ENTRY'}</strong>
            </div>
            <div className={protectionFound ? 'timeline-node is-confirmed' : 'timeline-node'}>
              <span>21:12</span><i /><strong>{protectionFound ? 'PROTECTION ACTIVE' : 'UNREAD ENTRY'}</strong>
            </div>
          </div>

          <div className="power-signal" aria-hidden="true">
            <span /><span /><span /><span /><span /><span /><span /><span /><span /><span />
          </div>

          <div className="system-panel power-log-panel" data-testid="power-log-source">
            <span>{spikeFound ? POWER_SPIKE.log.spike : '21:11 // OPEN ENTRY TO READ'}</span>
            <span>{protectionFound ? POWER_SPIKE.log.protection : '21:12 // NOT YET INSPECTED'}</span>
            {protectionFound && <strong data-testid="power-contained-status">{POWER_SPIKE.log.status}</strong>}
          </div>

          {!spikeFound && (
            <button className="primary" data-testid="inspect-power-spike" onClick={onInspectSpike}>
              Inspect the 21:11 log
            </button>
          )}
          {spikeFound && !protectionFound && (
            <button className="secondary" data-testid="inspect-power-protection" onClick={onInspectProtection}>
              Inspect the 21:12 protection entry
            </button>
          )}
          {protectionFound && (
            <div className="evidence-note">
              <strong>Evidence logged</strong>
              <span>The log records the protection layer active one minute after the spike. This is an optional source, not a Coupler verdict.</span>
            </div>
          )}

          <button className="navigation-button nav-primary" data-testid="power-back-hub" onClick={onBack}>
            ← NAV // ACTIVE THREADS
          </button>
        </div>
      </div>
    </section>
  )
}
