import { Helmet } from "react-helmet-async"

import { CONFIG } from "../../../global-config"

// ----------------------------------------------------------------------

const metadata = { title: `Staff list | Dashboard - ${CONFIG.appName}` }

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      {/* <StaffListView /> */}
      <div>Staff List</div>
    </>
  )
}
