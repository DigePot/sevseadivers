import { Helmet } from "react-helmet-async"

import { CONFIG } from "../../global-config"
import {StaffCourseListView } from "../../sections/staff-dashboard/courses/view/staff-view"

// ----------------------------------------------------------------------

const metadata = { title: `My Courses - ${CONFIG.appName}` }

export default function MyCoursesPage() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      < StaffCourseListView/>
    </>
  )
}
