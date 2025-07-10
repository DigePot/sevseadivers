import type { RouteObject } from "react-router"

import { lazy, Suspense } from "react"
import { Outlet } from "react-router"

import { DashboardLayout } from "../../layouts/dashboard"

import { AuthGuard } from "../../sections/auth/guard"

// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import("../../pages/dashboard"))
const AnalyticPage = lazy(
  () => import("../../pages/dashboard/general/analytics/index")
)
const ReportPage = lazy(
  () => import("../../pages/dashboard/general/report/index")
)
const StaffListPage = lazy(() => import("../../pages/dashboard/staff/list"))
const StaffCreatePage = lazy(() => import("../../pages/dashboard/staff/new"))
const StaffEditPage = lazy(() => import("../../pages/dashboard/staff/edit"))

const TripListPage = lazy(() => import("../../pages/dashboard/trip/list"))
const TripCreatePage = lazy(() => import("../../pages/dashboard/trip/new"))
const TripEditPage = lazy(() => import("../../pages/dashboard/trip/edit"))

const CourseListPage = lazy(() => import("../../pages/dashboard/course/list"))
const CourseCreatePage = lazy(() => import("../../pages/dashboard/course/new"))
const CourseEditPage = lazy(() => import("../../pages/dashboard/course/edit"))

const GalleryListPage = lazy(() => import("../../pages/dashboard/gallery/list"))
const GalleryCreatePage = lazy(
  () => import("../../pages/dashboard/gallery/new")
)
const GalleryEditPage = lazy(() => import("../../pages/dashboard/gallery/edit"))

const BookingPage = lazy(() => import("../../pages/dashboard/booking/index"))

// ----------------------------------------------------------------------

const dashboardLayout = () => (
  <DashboardLayout>
    <Suspense fallback={<div>Loading...</div>}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
)

export const dashboardRoutes: RouteObject[] = [
  {
    path: "dashboard",
    element: (
      <AuthGuard allowedRoles={["admin"]}>{dashboardLayout()}</AuthGuard>
    ),

    children: [
      { index: true, element: <IndexPage /> },
      { path: "analytic", element: <AnalyticPage /> },
      { path: "report", element: <ReportPage /> },
      {
        path: "Staff",
        children: [
          { index: true, path: "list", element: <StaffListPage /> },
          { path: "new", element: <StaffCreatePage /> },
          { path: ":id/edit", element: <StaffEditPage /> },
        ],
      },
      {
        path: "Trip",
        children: [
          { index: true, path: "list", element: <TripListPage /> },
          { path: "new", element: <TripCreatePage /> },
          { path: ":id/edit", element: <TripEditPage /> },
        ],
      },
      {
        path: "Course",
        children: [
          { index: true, path: "list", element: <CourseListPage /> },
          { path: "new", element: <CourseCreatePage /> },
          { path: ":id/edit", element: <CourseEditPage /> },
        ],
      },
      {
        path: "Gallery",
        children: [
          { index: true, path: "list", element: <GalleryListPage /> },
          { path: "new", element: <GalleryCreatePage /> },
          { path: ":id/edit", element: <GalleryEditPage /> },
        ],
      },
      { path: "booking", element: <BookingPage /> },
    ],
  },
]
