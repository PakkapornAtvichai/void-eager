import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

export type PinCueOption = { id: string; label: string }

type Props = {
  pinned: boolean
  options: PinCueOption[]
  onPin: (cueId: string) => void
  onHandle: () => void
  onMinimize: () => void
}

export function IncomingInterruption({ pinned, options, onPin, onHandle, onMinimize }: Props) {
  const [editingPin, setEditingPin] = useState(false)
  const [choice, setChoice] = useState(options[0]?.id ?? '')
  const cardRef = useRef<HTMLElement>(null)
  const handleRef = useRef<HTMLButtonElement>(null)
  const firstCueRef = useRef<HTMLInputElement>(null)
  const priorFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    priorFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    handleRef.current?.focus()
    return () => {
      if (priorFocus.current?.isConnected) priorFocus.current.focus()
    }
  }, [])

  useEffect(() => {
    if (editingPin) firstCueRef.current?.focus()
    else handleRef.current?.focus()
  }, [editingPin])

  const trapFocus = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      if (editingPin) setEditingPin(false)
      else onMinimize()
      return
    }
    if (event.key !== 'Tab') return
    const controls = Array.from(
      cardRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled])') ?? [],
    )
    const first = controls[0]
    const last = controls[controls.length - 1]
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
    <div className="incident-modal-backdrop" data-testid="incident-dialog-backdrop">
      <section
        ref={cardRef}
        className="incident-dialog-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="incident-dialog-title"
        data-testid="incoming-interruption"
        onKeyDown={trapFocus}
      >
        <div className="incident-dialog-card__header">
          <span>SHIP SYSTEM // C-17</span>
          <button type="button" data-testid="minimize-incident" onClick={onMinimize}>
            LATER / MINIMIZE
          </button>
        </div>
        <h2 id="incident-dialog-title">Coolant sensor alert</h2>
        <p>Coolant readings disagree. Ship systems need a classification.</p>
        <p className="incident-dialog-card__context">
          Your investigation remains available. Save a reminder of what you intended to do next, if helpful.
        </p>

        {editingPin && (
          <fieldset className="incident-pin-choices" data-testid="pin-choices">
            <legend>What were you planning to check next?</legend>
            {options.map((option, index) => (
              <label key={option.id}>
                <input
                  type="radio"
                  ref={index === 0 ? firstCueRef : undefined}
                  name="incident-pin-choice"
                  value={option.id}
                  checked={choice === option.id}
                  onChange={() => setChoice(option.id)}
                />
                {option.label}
              </label>
            ))}
            <div className="incident-pin-choices__actions">
              <button
                type="button"
                data-testid="save-selected-pin"
                disabled={!choice}
                onClick={() => {
                  onPin(choice)
                  setEditingPin(false)
                }}
              >
                SAVE THIS NOTE
              </button>
              <button type="button" data-testid="cancel-pin" onClick={() => setEditingPin(false)}>
                CANCEL
              </button>
            </div>
          </fieldset>
        )}

        {pinned && !editingPin && <p className="incident-pin-confirmation" role="status">CONTEXT SAVED // Your own reminder is available after C-17.</p>}

        <div className="incident-dialog-card__actions">
          <button
            className="secondary"
            type="button"
            data-testid="pin-current-context"
            onClick={() => {
              setEditingPin((current) => !current)
              if (!editingPin) setChoice(options[0]?.id ?? '')
            }}
          >
            {pinned ? 'EDIT CONTEXT' : 'SAVE CONTEXT'}
          </button>
          <button
            className="primary"
            ref={handleRef}
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
