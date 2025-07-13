import { Helmet } from "react-helmet-async"

import { CONFIG } from "../../global-config"
import { ProfileView } from "../../sections/shared/profile/view"

// ----------------------------------------------------------------------

const metadata = { title: `Booking - ${CONFIG.appName}` }

export default function OverviewAppPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProfileView />
    </>
  )
}
