import type { RouteObject } from "react-router"

import { lazy, Suspense } from "react"
import { Outlet } from "react-router"

import { DashboardLayout } from "../../layouts/dashboard"

import { AuthGuard } from "../../sections/auth/guard"
import Spinner from "../../components/Spinner"

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

// ----------------------------------------------------------------------

const dashboardLayout = () => (
  <DashboardLayout>
    <Suspense fallback={<Spinner />}>
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
    ],
  },
]
