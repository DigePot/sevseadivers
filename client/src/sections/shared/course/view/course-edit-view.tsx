import type { Course } from "../../../../types/course"
import { CourseEditForm } from "../course-edit-form"

// ----------------------------------------------------------------------

type Props = {
  currentCourse?: Course | null
}

export function CourseEditView({ currentCourse: currentCourse }: Props) {
  return <CourseEditForm currentCourse={currentCourse} />
}
