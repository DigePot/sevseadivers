import { Helmet } from "react-helmet-async"

import { CONFIG } from "../../../global-config"
import { RentalListView } from "../../../sections/shared/rental/view"

// ----------------------------------------------------------------------

const metadata = { title: `Rental items list | Dashboard - ${CONFIG.appName}` }

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <RentalListView />
    </>
  )
}
