import { Helmet } from "react-helmet-async"

import { CONFIG } from "../../../global-config"
import { TripListView } from "../../../sections/shared/trip/view"

// ----------------------------------------------------------------------

const metadata = { title: `Trip list | Dashboard - ${CONFIG.appName}` }

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TripListView />
    </>
  )
}
