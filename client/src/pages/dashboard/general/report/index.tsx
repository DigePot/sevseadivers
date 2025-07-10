import { Helmet } from "react-helmet-async"

import { CONFIG } from "../../../../global-config"
import { ReportView } from "../../../../sections/dashboard/general/report/views"

// ----------------------------------------------------------------------

const metadata = { title: `Report | Dashboard - ${CONFIG.appName}` }

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ReportView />
    </>
  )
}
