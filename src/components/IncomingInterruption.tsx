import { useEffect, useState } from 'react'

type Props = {
  pinned: boolean
  onPin: () => void
  onHandle: () => void
}

export function IncomingInterruption({ pinned, onPin, onHandle }: Props) {
  const [seconds, setSeconds] = useState(8)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSeconds((value) => Math.max(0, value - 1))
    }, 1000)
    const timeout = window.setTimeout(onHandle, 8000)

    return () => {
      window.clearInterval(interval)
      window.clearTimeout(timeout)
    }
  }, [onHandle])
  return (
    <aside className="incoming-interruption" data-testid="incoming-interruption" aria-live="assertive">
      <div>
        <p className="eyebrow">INCOMING INCIDENT // C-17</p>
        <strong>Coolant telemetry requires attention.</strong>
        <span>Context switch in {seconds}s</span>
      </div>
      <div className="button-row">
        <button className="secondary" data-testid="pin-current-context" onClick={onPin} disabled={pinned}>
          {pinned ? 'Context pinned' : 'Pin current context'}
        </button>
        <button className="primary" data-testid="handle-interruption-now" onClick={onHandle}>
          Handle now
        </button>
      </div>
    </aside>
  )
}
