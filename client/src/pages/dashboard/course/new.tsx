import { Helmet } from "react-helmet-async"

import { CONFIG } from "../../../global-config"
import { CourseNewCreateForm } from "../../../sections/dashboard/course/course-new-create-form"

const metadata = {
  title: `Create a new Course | Dashboard - ${CONFIG.appName}`,
}

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CourseNewCreateForm />
    </>
  )
}
