import { Helmet } from "react-helmet-async"

import { CONFIG } from "../../../global-config"
import { StaffNewCreateForm } from "../../../sections/dashboard/staff/staff-new-create-form"

const metadata = { title: `Create a new staff | Dashboard - ${CONFIG.appName}` }

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <StaffNewCreateForm />
    </>
  )
}
