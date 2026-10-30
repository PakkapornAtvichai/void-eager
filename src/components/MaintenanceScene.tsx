import { MaintenanceRoomScene } from './MaintenanceRoomScene'
import type { MaintenanceInspectionArea } from './MaintenanceInspectionScene'

type Props = {
  onWorkstation: () => void
  onInspect: (area: MaintenanceInspectionArea) => void
  hubAvailable: boolean
  onHub: () => void
}

export function MaintenanceScene({ onWorkstation, onInspect, hubAvailable, onHub }: Props) {
  return (
    <MaintenanceRoomScene
      onWorkstation={onWorkstation}
      onInspect={onInspect}
      hubAvailable={hubAvailable}
      onHub={onHub}
    />
  )
}
