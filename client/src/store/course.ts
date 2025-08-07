import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Course } from "../types/course";
import { API } from "./api";

export const courseApi = createApi({
  reducerPath: "courseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API,
    prepareHeaders: (headers, { endpoint }) => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      

      if (endpoint !== "createCourse" && endpoint !== "updateCourse") {
        headers.set("Content-Type", "application/json");
      }
      
      return headers;
    },
  }),
  tagTypes: ["Course"],
  endpoints: (builder) => ({
    getCourses: builder.query<Course[], void>({
      query: () => ({
        url: `/courses/all`,
        method: "GET",
      }),
      providesTags: ["Course"],
    }),

    getCourse: builder.query<Course, string>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "GET",
      }),
      providesTags: ["Course"],
    }),

    // staff-specific courses
    getStaffCourses: builder.query<Course[], number>({
      query: (staffUserId) => ({
        url: `/courses/staff/${staffUserId}`,
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
    deleteCourse: builder.mutation<void, number>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),

    createCourse: builder.mutation<Course, FormData>({
      query: (formData) => ({
        url: `/courses/add`,
        method: "POST",
        body: formData,
        // Don't set Content-Type - let browser set it automatically for FormData
      }),
      invalidatesTags: ["Course"],
    }),

    updateCourse: builder.mutation<Course, { id: number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/courses/${id}`,
        method: "PUT",
        body: formData,
        // Don't set Content-Type - let browser set it automatically for FormData
      }),
      invalidatesTags: ["Course"],
    }),

    updateCourseOrder: builder.mutation<
      { success: boolean; message?: string; data?: Course[] },
      { courses: number[] }
    >({
      query: ({ courses }) => ({
        url: `/courses/order`,
        method: "PATCH",
        body: { courses },
      }),
      invalidatesTags: ["Course"],
      
      async onQueryStarted({ courses }, { dispatch, queryFulfilled, getState }) {
        // Get current state
        const state = getState() as any;
        const currentCourses = courseApi.endpoints.getCourses.select()(state).data || [];
        
        // Create optimistic update
        const optimisticOrder = [...currentCourses].sort((a, b) => {
          return courses.indexOf(a.id) - courses.indexOf(b.id);
        });

        // Dispatch optimistic update
        const patchResult = dispatch(
          courseApi.util.updateQueryData(
            "getCourses",
            undefined,
            () => optimisticOrder
          )
        );

        try {
          const { data } = await queryFulfilled;
          // If server returns updated data, use it
          if (data?.data) {
            dispatch(
              courseApi.util.updateQueryData(
                "getCourses",
                undefined,
                () => data.data
              )
            );
          }
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseQuery,
   useGetStaffCoursesQuery,
  useDeleteCourseMutation,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useUpdateCourseOrderMutation,
} = courseApi;