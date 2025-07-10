import { Helmet } from "react-helmet-async"

import { CONFIG } from "../../../../global-config"
import { AdminAnalyticView } from "../../../../sections/dashboard/general/analytic/views"

// ----------------------------------------------------------------------

const metadata = { title: `Analytics | Dashboard - ${CONFIG.appName}` }

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AdminAnalyticView />
    </>
  )
}
