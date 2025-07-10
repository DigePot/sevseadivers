import { Helmet } from "react-helmet-async"

import { CONFIG } from "../../../global-config"
import { CourseListView } from "../../../sections/dashboard/course/view"

// ----------------------------------------------------------------------

const metadata = { title: `Course list | Dashboard - ${CONFIG.appName}` }

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CourseListView />
    </>
  )
}
