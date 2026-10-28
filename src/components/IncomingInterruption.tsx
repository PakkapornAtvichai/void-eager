type Props = {
  pinned: boolean
  onPin: () => void
  onHandle: () => void
}

export function IncomingInterruption({ pinned, onPin, onHandle }: Props) {
  return (
    <aside className="incoming-interruption" data-testid="incoming-interruption" aria-live="assertive">
      <div>
        <p className="eyebrow">INCOMING INCIDENT // C-17</p>
        <strong>Shipwide coolant telemetry requires triage.</strong>
        <span>Alert C-17 was routed to the Incident Systems Officer. Your Coupler report remains open. Pin it if a resumption cue would help.</span>
      </div>
      <div className="button-row">
        <button className="secondary" data-testid="pin-current-context" onClick={onPin} disabled={pinned}>
          {pinned ? 'Context pinned' : 'Pin current context'}
        </button>
        <button className="primary" data-testid="handle-interruption-now" onClick={onHandle}>
          Handle incident
        </button>
      </div>
    </aside>
  )
}
