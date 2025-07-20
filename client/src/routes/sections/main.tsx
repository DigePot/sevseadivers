import type { RouteObject } from "react-router"

import { lazy, Suspense } from "react"
import { Outlet } from "react-router"

import { MainLayout } from "../../layouts/main"
import Spinner from "../../components/Spinner"

// ----------------------------------------------------------------------

const AboutPage = lazy(() => import("../../pages/main/about-us"))
const ContactPage = lazy(() => import("../../pages/main/contact-us"))
const TripsPage = lazy(() => import("../../pages/main/trips"))
const CoursePage = lazy(() => import("../../pages/main/courses/index"))
const CourseDetailsPage = lazy(
  () => import("../../pages/main/courses/components/course-details")
)
import MyCoursesPage from "../../pages/main/courses/enrolled/my-courses"

const ServicePage = lazy(() => import("../../pages/main/service/index"))
const GalleryPage = lazy(() => import("../../pages/main/gallery/index"))
const CourseCheckoutPage = lazy(
  () => import("../../pages/main/courses/components/course-checkout")
)
const CourseEnrolledPage = lazy(
  () => import("../../pages/main/courses/components/course-checkout")
)
const EnrollmentSuccessPage = lazy(() => import("../../payment/payment-succes"))

const ForgotPasswordPage = lazy(
  () => import("../../pages/main/forgot-password")
)
const ResetPasswordPage = lazy(() => import("../../pages/main/reset-password"))

// ------------------------------------------------------------------------

export const mainRoutes: RouteObject[] = [
  {
    element: (
      <Suspense fallback={<Spinner />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      {
        element: (
          <MainLayout>
            <Outlet />
          </MainLayout>
        ),
        children: [
          { path: "about-us", element: <AboutPage /> },
          { path: "contact-us", element: <ContactPage /> },
          { path: "trips", element: <TripsPage /> },
          { path: "courses", element: <CoursePage /> },
          { path: "services", element: <ServicePage /> },
          { path: "gallery", element: <GalleryPage /> },
          { path: "courses/:id", element: <CourseDetailsPage /> },
          { path: "courses/:id/checkout", element: <CourseCheckoutPage /> },
          { path: "enrollments", element: <CourseEnrolledPage /> },
          { path: "enrollments/success", element: <EnrollmentSuccessPage /> },
          { path: "mycourses", element: <MyCoursesPage /> },
          { path: "forgot-password", element: <ForgotPasswordPage /> },
          { path: "reset-password", element: <ResetPasswordPage /> },
        ],
      },
    ],
  },
]
