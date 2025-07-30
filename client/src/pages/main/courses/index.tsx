import { Helmet } from "react-helmet-async"

import { CONFIG } from "../../../global-config"
import { CourseView } from "../../../sections/main/course/view"

// ----------------------------------------------------------------------

const metadata = { title: `Contact us - ${CONFIG.appName}` }

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CourseView />
    </>
  )
}
