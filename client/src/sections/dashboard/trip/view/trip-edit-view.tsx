import { paths } from "../../../../routes/paths"

import { TripEditForm } from "../trip-edit-form"

// ----------------------------------------------------------------------

type Props = {
  user?: any
}

export function UserEditView({ user: currentUser }: Props) {
  return <TripEditForm currentTrip={currentUser} />
}
