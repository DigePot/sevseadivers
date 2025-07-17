import type { Trip } from "../../../../types/trip"
import { TripEditForm } from "../trip-edit-form"

// ----------------------------------------------------------------------

type Props = {
  currentTrip?: Trip
}

export function UserEditView({ currentTrip: currentTrip }: Props) {
  return <TripEditForm currentTrip={currentTrip} />
}
