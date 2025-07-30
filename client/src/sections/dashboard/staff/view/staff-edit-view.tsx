import type { Staff } from "../../../../types/staff"
import { StaffEditForm } from "../staff-edit-form"

// ----------------------------------------------------------------------

type Props = {
  currentStaff?: Staff
}

export function UserEditView({ currentStaff: currentStaff }: Props) {
  return <StaffEditForm currentStaff={currentStaff} />
}
