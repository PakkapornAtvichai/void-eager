import { MaintenanceRoomScene } from './MaintenanceRoomScene'

type Props = {
  onWorkstation: () => void
}

export function MaintenanceScene({ onWorkstation }: Props) {
  return <MaintenanceRoomScene onWorkstation={onWorkstation} />
}
