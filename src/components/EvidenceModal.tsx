import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'

type Props = {
  title: string
  kicker?: string
  children: ReactNode
  onClose: () => void
  testId?: string
}

/** Reusable in-world reading surface. Investigation remains in the scene behind it. */
export function EvidenceModal({ title, kicker = 'INSPECTED DETAIL', children, onClose, testId = 'evidence-dialog' }: Props) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
      if (event.key === 'Tab') {
        // Support optional actions inside Hint while keeping focus inside the modal.
        const buttons = Array.from(dialogRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [])
        const first = buttons[0]
        const last = buttons[buttons.length - 1]
        if (!first || !last) return
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        } else if (!dialogRef.current?.contains(document.activeElement)) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      previous?.focus()
    }
  }, [onClose])

  return (
    <div
      className="evidence-modal-backdrop"
      data-testid="evidence-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section ref={dialogRef} className="evidence-modal" role="dialog" aria-modal="true" aria-labelledby={titleId} data-testid={testId}>
        <div className="evidence-modal__header">
          <span>{kicker}</span>
          <button
            ref={closeRef}
            className="evidence-modal__close"
            type="button"
            data-testid="close-evidence"
            onClick={onClose}
            aria-label="Close evidence details"
          >
            CLOSE ×
          </button>
        </div>
        <h2 id={titleId}>{title}</h2>
        <div className="evidence-modal__content">{children}</div>
      </section>
    </div>
  )
}
