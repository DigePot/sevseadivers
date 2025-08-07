import type { RouteObject } from "react-router"

import { lazy, Suspense } from "react"
import { Outlet } from "react-router"

import { StaffLayout } from "../../layouts/staff"
import { AuthGuard } from "../../sections/auth/guard"
import Spinner from "../../components/Spinner"

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import("../../pages/shared/booking"))
const MycoursesPage = lazy(() => import("../../pages/staff/my-courses"))


// ----------------------------------------------------------------------

const staffLayout = () => (
  <StaffLayout>
    <Suspense fallback={<Spinner />}>
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
        path: "my-courses", 
        element: <MycoursesPage />,
      },
  ],
  },
]
