import { Helmet } from "react-helmet-async"

import { CONFIG } from "../../../global-config"
import { RentalView } from "../../../sections/main/rental/view"

// ----------------------------------------------------------------------

const metadata = { title: `Rental Equipments - ${CONFIG.appName}` }

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <RentalView />
    </>
  )
}
