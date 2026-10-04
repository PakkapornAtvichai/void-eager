import { MaintenanceRoomScene } from './MaintenanceRoomScene'

type Props = {
  onWorkstation: () => void
  hubAvailable: boolean
  onHub: () => void
}

export function MaintenanceScene({ onWorkstation, hubAvailable, onHub }: Props) {
  return (
    <MaintenanceRoomScene
      onWorkstation={onWorkstation}
      hubAvailable={hubAvailable}
      onHub={onHub}
    />
  )
}
