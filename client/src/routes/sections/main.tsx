import type { RouteObject } from "react-router"

import { lazy, Suspense } from "react"
import { Outlet } from "react-router"

import { MainLayout } from "../../layouts/main"


// ----------------------------------------------------------------------

const AboutPage = lazy(() => import("../../pages/about-us"))
const ContactPage = lazy(() => import("../../pages/contact-us"))
const TripsPage = lazy(() => import("../../pages/trips"))

// ----------------------------------------------------------------------

export const mainRoutes: RouteObject[] = [
  {
    element: (
      <Suspense fallback={<div>SplashScreen</div>}>
        <Outlet />
      </Suspense>
    ),
    children: [
      {
        element: (
          <MainLayout>
            <Outlet />
          </MainLayout>
        ),
        children: [
          { path: "about-us", element: <AboutPage /> },
          { path: "contact-us", element: <ContactPage /> },
          { path: "trips", element: <TripsPage /> },
        ],
      },
    ],
  },
]
