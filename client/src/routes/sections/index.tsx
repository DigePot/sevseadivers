import type { RouteObject } from "react-router"

import { lazy, Suspense } from "react"

import { MainLayout } from "../../layouts/main"

import { authRoutes } from "./auth"
import { dashboardRoutes } from "./dashboard"
import { mainRoutes } from "./main"
import { staffRoutes } from "./staff"
const Page403 = lazy(() => import("../../pages/error/403"))
const Page404 = lazy(() => import("../../pages/error/404"))

// ----------------------------------------------------------------------

const HomePage = lazy(() => import("../../pages/home"))

export const routesSection: RouteObject[] = [
  {
    path: "/",
    element: (
      <Suspense fallback={<div>SplashScreen</div>}>
        <MainLayout>
          <HomePage />
        </MainLayout>
      </Suspense>
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
