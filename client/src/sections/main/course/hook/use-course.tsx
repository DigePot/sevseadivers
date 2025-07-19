import { useGetCoursesQuery } from "../../../../store/course";
import type { Course } from "../../../../types/course";

export function useCourses() {
  const { 
    data, 
    error, 
    isLoading, 
    isError, 
    isSuccess 
  } = useGetCoursesQuery();

  // Handle error formatting
  let errorMessage = null;
  if (error) {
    if ('status' in error) {
      // Handle FetchBaseQueryError
      errorMessage = typeof error.data === 'string' 
        ? error.data 
        : 'Error fetching courses';
    } else {
      // Handle SerializedError
      errorMessage = error.message || 'Error fetching courses';
    }
  }

  return {
    courses: (isSuccess ? data : []) as Course[],
    loading: isLoading,
    error: errorMessage,
    isError,
    isSuccess,
  };
}