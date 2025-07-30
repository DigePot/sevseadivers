import { lazy, Suspense } from "react"
import type { RouteObject } from "react-router"
import { Outlet } from "react-router"
import { AuthCenteredLayout } from "../../layouts/auth-centered"

/** **************************************
 * Jwt
 *************************************** */
const Jwt = {
  SignInPage: lazy(() => import("../../pages/auth/sign-in")),
  SignUpPage: lazy(() => import("../../pages/auth/sign-up")),
}

const authJwt: RouteObject = {
  path: "auth",
  element: (
    <Suspense fallback={<div>Loading...</div>}>
      <Outlet />
    </Suspense>
  ),
  children: [
    {
      path: "sign-in",
      element: (
        <AuthCenteredLayout>
          <Jwt.SignInPage />
        </AuthCenteredLayout>
      ),
    },
    {
      path: "sign-up",
      element: (
        <AuthCenteredLayout>
          <Jwt.SignUpPage />
        </AuthCenteredLayout>
      ),
    },
  ],
}

// ----------------------------------------------------------------------

export const authRoutes: RouteObject[] = [authJwt]
