import { Helmet } from "react-helmet-async"

import { useParams } from "../../../routes/hooks"

import { CONFIG } from "../../../global-config"
import { RentalEditView } from "../../../sections/shared/rental/view"
import { useRental } from "../../../sections/shared/rental/hooks"

// ----------------------------------------------------------------------

const metadata = { title: `Rental item edit | Dashboard - ${CONFIG.appName}` }

export default function Page() {
  const { id = "" } = useParams()
  const { rental } = useRental(id)

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <RentalEditView currentRental={rental} />
    </>
  )
}
