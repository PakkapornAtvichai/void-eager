import { POWER_SPIKE } from '../content/power'

type Props = {
  spikeFound: boolean
  protectionFound: boolean
  onInspectSpike: () => void
  onInspectProtection: () => void
  onBack: () => void
}

export function PowerScene({
  spikeFound,
  protectionFound,
  onInspectSpike,
  onInspectProtection,
  onBack,
}: Props) {
  return (
    <section className="scene-card reading-scene" data-testid="power-scene" aria-labelledby="power-title">
      <p className="eyebrow">ENGINEERING // POWER LOG</p>
      <h2 id="power-title">21:11 anomaly window</h2>
      <p className="thread-question">{POWER_SPIKE.thread}</p>
      <div className="system-panel">
        <span>{POWER_SPIKE.log.spike}</span>
        <span>{POWER_SPIKE.log.protection}</span>
        <strong>{POWER_SPIKE.log.status}</strong>
      </div>

      {!spikeFound && (
        <button className="primary" data-testid="inspect-power-spike" onClick={onInspectSpike}>
          Log the 21:11 spike
        </button>
      )}

      {spikeFound && !protectionFound && (
        <button className="secondary" data-testid="inspect-power-protection" onClick={onInspectProtection}>
          Check what happened at 21:12
        </button>
      )}
      {protectionFound && (
        <div className="evidence-note">
          <strong>Evidence logged</strong>
          <span>The protection layer reports the 21:11 anomaly as contained one minute later.</span>
        </div>
      )}

      <button className="secondary" data-testid="power-back-hub" onClick={onBack}>
        Back to active threads
      </button>
    </section>
  )
}
