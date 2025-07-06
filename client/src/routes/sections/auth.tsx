// // import type { RouteObject } from "react-router"

// // import { lazy, Suspense } from "react"
// // import { Outlet } from "react-router"

// // import { AuthCenteredLayout } from "../../layouts/auth-centered"

// // // ----------------------------------------------------------------------

// // /** **************************************
// //  * Jwt
// //  *************************************** */
// // const Jwt = {
// //   SignInPage: lazy(() => import("../../pages/auth/sign-in")),
// //   SignUpPage: lazy(() => import("../../pages/auth/sign-up")),
// // }

// // const authJwt = {
// //   path: "auth",
// //   children: [
// //     {
// //       path: "sign-in",
// //       element: (
// //         <AuthCenteredLayout>
// //           <Jwt.SignInPage />
// //         </AuthCenteredLayout>
// //       ),
// //     },
// //     {
// //       path: "sign-up",
// //       element: (
// //         <AuthCenteredLayout>
// //           <Jwt.SignUpPage />
// //         </AuthCenteredLayout>
// //       ),
// //     },
// //   ],
// // }

// // // ----------------------------------------------------------------------

// // export const authRoutes: RouteObject[] = [
// //   {
// //     path: "auth",
// //     element: (
// //       <Suspense fallback={<div>SplashScreen</div>}>
// //         <Outlet />
// //       </Suspense>
// //     ),
// //     children: [authJwt],
// //   },
// // ]

// import type { RouteObject } from "react-router"
// import { lazy, Suspense } from "react"
// import { Outlet } from "react-router"
// import { AuthCenteredLayout } from "../../layouts/auth-centered"

// /** **************************************
//  * Jwt
//  *************************************** */
// const Jwt = {
//   SignInPage: lazy(() => import("../../pages/auth/sign-in")),
//   SignUpPage: lazy(() => import("../../pages/auth/sign-up")),
// }

// const authJwt: RouteObject = {
//   path: "auth",
//   element: (
//     <Suspense fallback={<div>Loading...</div>}>
//       <Outlet />
//     </Suspense>
//   ),
//   children: [
//     {
//       path: "sign-in",
//       element: (
//         <AuthCenteredLayout>
//           <Jwt.SignInPage />
//         </AuthCenteredLayout>
//       ),
//     },
//     {
//       path: "sign-up",
//       element: (
//         <AuthCenteredLayout>
//           <Jwt.SignUpPage />
//         </AuthCenteredLayout>
//       ),
//     },
//   ],
// }

// // ----------------------------------------------------------------------

// export const authRoutes: RouteObject[] = [authJwt]

import type { RouteObject } from "react-router"
import { lazy, Suspense } from "react"
import { Outlet } from "react-router"
import { AuthCenteredLayout } from "../../layouts/auth-centered"
import { GuestGuard } from "../../sections/auth/guard/guest-guard" // Import GuestGuard

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
    <GuestGuard>
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </GuestGuard>
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
