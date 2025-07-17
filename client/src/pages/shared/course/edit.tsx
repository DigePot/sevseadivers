import { Helmet } from "react-helmet-async"

import { useParams } from "../../../routes/hooks"

import { CONFIG } from "../../../global-config"
import { useCourse } from "../../../sections/shared/course/hooks"
import { CourseEditView } from "../../../sections/shared/course/view"

// ----------------------------------------------------------------------

const metadata = { title: `Course edit | Dashboard - ${CONFIG.appName}` }

export default function Page() {
  const { id = "" } = useParams()
  const { course } = useCourse(id)

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CourseEditView currentCourse={course} />
    </>
  )
}
