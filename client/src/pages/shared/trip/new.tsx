import { Helmet } from "react-helmet-async"

import { CONFIG } from "../../../global-config"
import { TripCreateView } from "../../../sections/shared/trip/view"

const metadata = { title: `Create a new Trip | Dashboard - ${CONFIG.appName}` }

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TripCreateView />
    </>
  )
}
