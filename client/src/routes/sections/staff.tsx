import type { RouteObject } from "react-router"

import { lazy, Suspense } from "react"
import { Outlet } from "react-router"

import { StaffLayout } from "../../layouts/staff"
import { AuthGuard } from "../../sections/auth/guard"

// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import("../../pages/staff-dashboard"))

// ----------------------------------------------------------------------

const staffLayout = () => (
  <StaffLayout>
    <Suspense fallback={<div>Loading...</div>}>
      <Outlet />
    </Suspense>
  </StaffLayout>
)

export const staffRoutes: RouteObject[] = [
  {
    path: "staff-dashboard",
    element: <AuthGuard allowedRoles={["staff"]}>{staffLayout()}</AuthGuard>,

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
