import { Helmet } from "react-helmet-async"
import { CONFIG } from "../../global-config"
import { View403 } from "../../sections/error"

const metadata = { title: `403 - ${CONFIG.appName}` }

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <View403 />
    </>
  )
}
