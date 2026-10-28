type Props = {
  pinned: boolean
  onPin: () => void
  onHandle: () => void
  onMinimize: () => void
}

export function IncomingInterruption({ pinned, onPin, onHandle, onMinimize }: Props) {
  return (
    <div className="incident-modal-backdrop" data-testid="incident-dialog-backdrop">
      <section
        className="incident-dialog-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="incident-dialog-title"
        data-testid="incoming-interruption"
      >
        <div className="incident-dialog-card__header">
          <span>SHIP SYSTEM // C-17</span>
          <button type="button" data-testid="minimize-incident" onClick={onMinimize}>
            LATER / MINIMIZE
          </button>
        </div>
        <h2 id="incident-dialog-title">Coolant sensor alert</h2>
        <p>The two coolant readings disagree. As Incident Systems Officer, classify the alert.</p>
        <p className="incident-dialog-card__context">
          Your Coupler investigation stays open. Save its context before switching, if helpful.
        </p>
        <div className="incident-dialog-card__actions">
          <button
            className="secondary"
            type="button"
            data-testid="pin-current-context"
            onClick={onPin}
            disabled={pinned}
          >
            {pinned ? 'CONTEXT SAVED' : 'SAVE CONTEXT'}
          </button>
          <button
            className="primary"
            type="button"
            data-testid="handle-interruption-now"
            onClick={onHandle}
          >
            HANDLE ALERT
          </button>
        </div>
      </section>
    </div>
  )
}

export function PendingIncidentTab({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      className="pending-incident-tab"
      data-testid="pending-incident-tab"
      onClick={onOpen}
      aria-label="Open pending Coolant Incident C-17"
    >
      <strong>! C-17 PENDING</strong>
      <span>OPEN ALERT</span>
    </button>
  )
}
