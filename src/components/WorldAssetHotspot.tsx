import type { CSSProperties } from 'react'
import type { HotspotBounds } from '../content/maintenanceAssets'

type Props = {
  label: string
  bounds: HotspotBounds
  testId?: string
  disabled?: boolean
  onActivate?: () => void
}

const percentStyle = (bounds: HotspotBounds): CSSProperties => ({
  left: `${(bounds.left / 1920) * 100}%`,
  top: `${(bounds.top / 1080) * 100}%`,
  width: `${(bounds.width / 1920) * 100}%`,
  height: `${(bounds.height / 1080) * 100}%`,
})

export function WorldAssetHotspot({
  label,
  bounds,
  testId,
  disabled = false,
  onActivate,
}: Props) {
  return (
    <button
      type="button"
      className="world-hotspot"
      style={percentStyle(bounds)}
      data-testid={testId}
      aria-label={label}
      disabled={disabled}
      onClick={onActivate}
    >
      <span className="world-hotspot__label">{label}</span>
    </button>
  )
}
