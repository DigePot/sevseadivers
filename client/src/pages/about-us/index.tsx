import { Helmet } from "react-helmet-async"
import { CONFIG } from "../../global-config"
import {AboutView} from "../../sections/about/view/AboutView";

const metadata = { title: `About us - ${CONFIG.appName}` }

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <AboutView />
    </>
  )
}
