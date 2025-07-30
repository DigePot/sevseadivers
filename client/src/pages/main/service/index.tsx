import { Helmet } from "react-helmet-async"

import { CONFIG } from "../../../global-config"
import { ServiceView } from "../../../sections/main/service/view"

// ----------------------------------------------------------------------

const metadata = { title: `Contact us - ${CONFIG.appName}` }

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ServiceView />
    </>
  )
}
