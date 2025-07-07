import type { RouteObject } from "react-router"

import { lazy, Suspense } from "react"
import { Outlet } from "react-router"

import { DashboardLayout } from "../../layouts/dashboard"

import { AuthGuard } from "../../sections/auth/guard"

// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import("../../pages/dashboard"))
const StaffListPage = lazy(() => import("../../pages/dashboard/staff/list"))
const StaffCreatePage = lazy(() => import("../../pages/dashboard/staff/new"))
const StaffEditPage = lazy(() => import("../../pages/dashboard/staff/edit"))

const TripListPage = lazy(() => import("../../pages/dashboard/trip/list"))
const TripCreatePage = lazy(() => import("../../pages/dashboard/trip/new"))
const TripEditPage = lazy(() => import("../../pages/dashboard/trip/edit"))

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
    ],
  },
]
