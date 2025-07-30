import { Helmet } from "react-helmet-async"

import { CONFIG } from "../../../global-config"
import { ForgotPasswordView } from "../../../sections/main/forgot-password/view"

// ----------------------------------------------------------------------

const metadata = { title: `Forgot password - ${CONFIG.appName}` }

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ForgotPasswordView />
    </>
  )
}
