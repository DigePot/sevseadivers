import { Helmet } from "react-helmet-async"

// import { useParams } from '../../../routes/hooks';

import { CONFIG } from "../../../global-config"
import { TripEditForm } from "../../../sections/dashboard/trip/trip-edit-form"

// ----------------------------------------------------------------------

const metadata = { title: `Trip edit | Dashboard - ${CONFIG.appName}` }

export default function Page() {
  // const { id = '' } = useParams();

  // const currentStaff =

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TripEditForm currentTrip={{}} />
    </>
  )
}
