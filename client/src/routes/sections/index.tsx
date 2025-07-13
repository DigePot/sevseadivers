import type { RouteObject } from "react-router"

import { lazy, Suspense } from "react"

import { MainLayout } from "../../layouts/main"

import { authRoutes } from "./auth"
import { dashboardRoutes } from "./dashboard"
import { mainRoutes } from "./main"
import { staffRoutes } from "./staff"
import { AuthGuard } from "../../sections/auth/guard"
import { DashboardLayout } from "../../layouts/dashboard"
import { StaffLayout } from "../../layouts/staff"
import Spinner from "../../components/Spinner"
const Page403 = lazy(() => import("../../pages/error/403"))
const Page404 = lazy(() => import("../../pages/error/404"))

// ----------------------------------------------------------------------

const HomePage = lazy(() => import("../../pages/home"))
const ProfilePage = lazy(() => import("../../pages/shared/index"))

const role = localStorage.getItem("role")

export const routesSection: RouteObject[] = [
  {
    path: "/",
    element: (
      <Suspense fallback={<Spinner />}>
        <MainLayout>
          <HomePage />
        </MainLayout>
      </Suspense>
    ),
  },

  {
    path: "profile",
    element: (
      <AuthGuard allowedRoles={["admin", "staff", "client"]}>
        {role === "admin" ? (
          <Suspense fallback={<Spinner />}>
            <DashboardLayout>
              <ProfilePage />
            </DashboardLayout>
          </Suspense>
        ) : role === "staff" ? (
          <Suspense fallback={<Spinner />}>
            <StaffLayout>
              <ProfilePage />
            </StaffLayout>
          </Suspense>
        ) : (
          <Suspense fallback={<Spinner />}>
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          </Suspense>
        )}
      </AuthGuard>
    ),
  },

  // Auth
  ...authRoutes,

  // Dashboard
  ...dashboardRoutes,

  ...staffRoutes,

  // Main
  ...mainRoutes,

  // Forbidden page for unauthorized access (add as a catch-all route or wherever needed)
  {
    path: "/forbidden",
    element: <Page403 />,
  },

  // No match
  { path: "*", element: <Page404 /> },
]
