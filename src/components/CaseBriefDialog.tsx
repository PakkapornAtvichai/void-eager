import { useEffect, useRef } from 'react'
import type { KeyboardEvent } from 'react'

type Props = {
  onExplore: () => void
  onWorkstation: () => void
}

/**
 * One-time system brief (also reopenable through Help).
 * Rendered at GameApp level so its backdrop stays above hotspots and the HUD.
 */
export function CaseBriefDialog({ onExplore, onWorkstation }: Props) {
  const dialogRef = useRef<HTMLElement>(null)
  const startRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    startRef.current?.focus()
    return () => {
      if (previous?.isConnected && previous !== document.body) previous.focus()
    }
  }, [])

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onExplore()
      return
    }
    if (event.key !== 'Tab') return

    const actions = Array.from(
      dialogRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [],
    )
    const first = actions[0]
    const last = actions[actions.length - 1]
    if (!first || !last) return

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <div className="case-brief-backdrop" data-testid="case-brief-backdrop">
      <section
        ref={dialogRef}
        className="case-brief-dialog"
        data-testid="mission-briefing"
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-brief-title"
        aria-describedby="case-brief-description"
        onKeyDown={onKeyDown}
      >
        <header className="case-brief-dialog__header">
          <span>VOID-EAGER // INCIDENT SYSTEMS OFFICE</span>
          <button type="button" className="case-brief-dialog__close" data-testid="close-case-brief" onClick={onExplore}>
            CLOSE ×
          </button>
        </header>
        <h1 id="case-brief-title">Verify the Coupler</h1>
        <p id="case-brief-description">
          Void-eager's stabilizer failed. Glint's log says the Coupler was replaced. Check that claim.
        </p>
        <div className="case-brief-dialog__actions">
          <button
            ref={startRef}
            type="button"
            className="case-brief-dialog__primary"
            data-testid="begin-coupler-investigation"
            onClick={onWorkstation}
          >
            OPEN WORKSTATION
          </button>
          <button type="button" className="case-brief-dialog__secondary" onClick={onExplore}>
            EXPLORE ROOM
          </button>
        </div>
        <small>Workbench and Junction are optional. You can revisit this brief through HINT.</small>
      </section>
    </div>
  )
}
