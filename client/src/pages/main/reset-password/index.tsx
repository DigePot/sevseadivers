import { Helmet } from "react-helmet-async"

import { CONFIG } from "../../../global-config"
import { ResetPasswordView } from "../../../sections/main/reset-password/view"

// ----------------------------------------------------------------------

const metadata = { title: `Reset password - ${CONFIG.appName}` }

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ResetPasswordView />
    </>
  )
}
