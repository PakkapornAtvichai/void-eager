import type { Interruption } from '../game/types'

type Props = {
  interruption: Interruption
  onPinAndOpen: () => void
  onOpen: () => void
}

export function InterruptionModal({ interruption, onPinAndOpen, onOpen }: Props) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="interrupt-title">
        <p className="eyebrow">INTERRUPTION</p>
        <h2 id="interrupt-title">{interruption.title}</h2>
        <p>{interruption.body}</p>
        <div className="button-row">
          <button className="primary" onClick={onPinAndOpen}>
            Quick Pin & Open
          </button>
          <button className="secondary" onClick={onOpen}>
            Open without pin
          </button>
        </div>
      </section>
    </div>
  )
}
