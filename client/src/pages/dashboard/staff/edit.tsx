import { Helmet } from "react-helmet-async"

import { useParams } from "../../../routes/hooks"

import { CONFIG } from "../../../global-config"
import { StaffEditForm } from "../../../sections/dashboard/staff/staff-edit-form"
import { useOneStaff } from "../../../sections/dashboard/staff/hooks"

// ----------------------------------------------------------------------

const metadata = { title: `Staff edit | Dashboard - ${CONFIG.appName}` }

export default function Page() {
  const { id = "" } = useParams()
  const { staff } = useOneStaff(id)

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <StaffEditForm currentStaff={staff} />
    </>
  )
}
