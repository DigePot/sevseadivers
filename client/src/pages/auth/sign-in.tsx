import { Helmet } from "react-helmet-async"

import { CONFIG } from "../../global-config"

import { JwtSignInView } from "../../sections/auth/view/jwt"

// ----------------------------------------------------------------------

const metadata = { title: `Sign in - ${CONFIG.appName}` }

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <JwtSignInView />
    </>
  )
}
