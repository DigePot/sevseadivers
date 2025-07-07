import { Helmet } from "react-helmet-async"

import { CONFIG } from "../../../global-config"

const metadata = { title: `Create a new staff | Dashboard - ${CONFIG.appName}` }

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      {/* <StaffCreateView /> */}
      <div>Staff create</div>
    </>
  )
}
