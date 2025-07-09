import { Helmet } from "react-helmet-async"

import { CONFIG } from "../../global-config"
import { DashboardOverviewView } from "../../sections/dashboard/overview/views"

// ----------------------------------------------------------------------

const metadata = { title: `Dashboard - ${CONFIG.appName}` }

export default function OverviewAppPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DashboardOverviewView />
    </>
  )
}
