import type { RouteObject } from "react-router"

import { lazy, Suspense } from "react"
import { Outlet } from "react-router"

import { DashboardLayout } from "../../layouts/dashboard"

import { AuthGuard, RoleBasedGuard } from "../../sections/auth/guard"

// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import("../../pages/dashboard"))

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
      <RoleBasedGuard allowedRoles={["admin"]}>
        <AuthGuard>{dashboardLayout()}</AuthGuard>,
      </RoleBasedGuard>
    ),
    children: [
      { index: true, element: <IndexPage /> },
      {
        path: "Staff",
        children: [
          { index: true, element: <div>Building</div> },
          { path: "profile", element: <div>Building</div> },
          { path: "list", element: <div>Building</div> },
          { path: "new", element: <div>Building</div> },
          { path: ":id/edit", element: <div>Building</div> },
        ],
      },
    ],
  },
]
