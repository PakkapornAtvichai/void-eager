import { HOTSPOT_BOUNDS, MAINTENANCE_ASSETS } from '../content/maintenanceAssets'
import { WorldAssetHotspot } from './WorldAssetHotspot'

type Props = {
  onWorkstation: () => void
  hubAvailable: boolean
  onHub: () => void
}

export function MaintenanceRoomScene({ onWorkstation, hubAvailable, onHub }: Props) {
  return (
    <section className="maintenance-stage" data-testid="maintenance-room" aria-label="Maintenance room">
      <div className="maintenance-canvas">
        <img
          className="maintenance-layer maintenance-layer--base"
          src={MAINTENANCE_ASSETS.background}
          alt="Maintenance room aboard Void-eager"
        />
        <img className="maintenance-layer" src={MAINTENANCE_ASSETS.clickWorkbench} alt="" aria-hidden="true" />
        <img className="maintenance-layer" src={MAINTENANCE_ASSETS.clickWorkstation} alt="" aria-hidden="true" />
        <img className="maintenance-layer" src={MAINTENANCE_ASSETS.clickJunction} alt="" aria-hidden="true" />

        <WorldAssetHotspot
          label="Open Glint's workstation"
          bounds={HOTSPOT_BOUNDS.workstation}
          testId="workstation-hotspot"
          onActivate={onWorkstation}
        />
        <WorldAssetHotspot
          label="Workbench — not part of this prototype loop"
          bounds={HOTSPOT_BOUNDS.workbench}
          disabled
        />
        <WorldAssetHotspot
          label="Junction panel — not part of this prototype loop"
          bounds={HOTSPOT_BOUNDS.junction}
          disabled
        />

        {hubAvailable && (
          <button
            type="button"
            className="maintenance-hub-exit"
            data-testid="maintenance-hub-exit"
            onClick={onHub}
            aria-label="Leave Maintenance and return to the Incident Hub"
          >
            <span>INCIDENT HUB</span>
            <small>EXIT MAINTENANCE</small>
          </button>
        )}
      </div>
    </section>
  )
}
