import type { RouteObject } from "react-router"

import { lazy, Suspense } from "react"
import { Outlet } from "react-router"

import { StaffLayout } from "../../layouts/staff"
import { AuthGuard } from "../../sections/auth/guard"

// ----------------------------------------------------------------------

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

    children: [{ index: true, element: <IndexPage /> }],
  },
]
