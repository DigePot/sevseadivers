import { Helmet } from "react-helmet-async"

import { CONFIG } from "../../../global-config"
import { ContactView } from "../../../sections/main/contact-us/view"

// ----------------------------------------------------------------------

const metadata = { title: `Contact us - ${CONFIG.appName}` }

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ContactView />
    </>
  )
}
