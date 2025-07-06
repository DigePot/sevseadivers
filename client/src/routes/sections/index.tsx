import type { RouteObject } from "react-router"

import { lazy, Suspense } from "react"

import { MainLayout } from "../../layouts/main"

import { authRoutes } from "./auth"
import { dashboardRoutes } from "./dashboard"
import { mainRoutes } from "./main"
import { staffRoutes } from "./staff"

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

  // No match
  // { path: "*", element: <div>Something went wrong!</div> },
]
