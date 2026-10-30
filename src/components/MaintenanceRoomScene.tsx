import { HOTSPOT_BOUNDS, MAINTENANCE_ASSETS } from '../content/maintenanceAssets'
import { WorldAssetHotspot } from './WorldAssetHotspot'
import type { MaintenanceInspectionArea } from './MaintenanceInspectionScene'

type Props = {
  onWorkstation: () => void
  onInspect: (area: MaintenanceInspectionArea) => void
  hubAvailable: boolean
  onHub: () => void
}

export function MaintenanceRoomScene({ onWorkstation, onInspect, hubAvailable, onHub }: Props) {
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
          label="Open Workstation"
          bounds={HOTSPOT_BOUNDS.workstation}
          testId="workstation-hotspot"
          onActivate={onWorkstation}
        />
        <WorldAssetHotspot
          label="Inspect Workbench"
          bounds={HOTSPOT_BOUNDS.workbench}
          testId="workbench-hotspot"
          onActivate={() => onInspect('workbench')}
        />
        <WorldAssetHotspot
          label="Inspect Junction"
          bounds={HOTSPOT_BOUNDS.junction}
          testId="junction-hotspot"
          onActivate={() => onInspect('junction')}
        />

        {hubAvailable && (
          <button
            type="button"
            className="maintenance-hub-exit"
            data-testid="maintenance-hub-exit"
            onClick={onHub}
            aria-label="Leave Maintenance and return to the Incident Hub"
          >
            <span>← HUB</span>
          </button>
        )}
      </div>
    </section>
  )
}
