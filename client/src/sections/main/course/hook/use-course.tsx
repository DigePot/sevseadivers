import { useGetCoursesQuery } from "../../../../store/course"; // Adjust the path as needed
import type { Course } from "../../../../types/course";

export function useCourses() {
  
  const { data, error, isLoading } = useGetCoursesQuery();

 
  return {
    courses: data as Course[] || [],
    loading: isLoading,
    error: error ? (typeof error === "string" ? error : "Error fetching courses") : null,
  };
}