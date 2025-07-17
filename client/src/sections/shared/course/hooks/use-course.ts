import { useGetCourseQuery } from "../../../../store/course"
import type { Course } from "../../../../types/course"

export const useCourse = (id: string) => {
  const { data, error, isLoading } = useGetCourseQuery(id)
  const course: Course | null = data || null

  return { course, error, isLoading }
}
