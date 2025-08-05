import { RentalEditForm } from "../rental-edit-form"

// ----------------------------------------------------------------------

type Props = {
  currentRental?: any
}

export function RentalEditView({ currentRental: currentRental }: Props) {
  return <RentalEditForm currentRental={currentRental} />
}
