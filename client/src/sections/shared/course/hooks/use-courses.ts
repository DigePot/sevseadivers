import { useGetCoursesQuery } from "../../../../store/course"
import type { Course } from "../../../../types/course"

export const useCourses = () => {
  const { data, error, isLoading } = useGetCoursesQuery()
  // console.log("data", data)
  const allCourses: Course[] = data || []

  return { allCourses, error, isLoading }
}
