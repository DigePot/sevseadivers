import { Helmet } from "react-helmet-async"

import { useParams } from "../../../routes/hooks"

import { CONFIG } from "../../../global-config"
import { TripEditForm } from "../../../sections/shared/trip/trip-edit-form"
import { useTrip } from "../../../sections/shared/trip/hooks/use-trip"

// ----------------------------------------------------------------------

const metadata = { title: `Trip edit | Dashboard - ${CONFIG.appName}` }

export default function Page() {
  const { id = "" } = useParams()
  const { Trip } = useTrip(id)

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TripEditForm currentTrip={Trip} />
    </>
  )
}
