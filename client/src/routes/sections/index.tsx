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
import { paths } from "../paths"
const Page403 = lazy(() => import("../../pages/error/403"))
const Page404 = lazy(() => import("../../pages/error/404"))

// ----------------------------------------------------------------------

const HomePage = lazy(() => import("../../pages/home"))
const ProfilePage = lazy(() => import("../../pages/shared/index"))

const GalleryListPage = lazy(() => import("../../pages/shared/gallery/list"))
const GalleryCreatePage = lazy(() => import("../../pages/shared/gallery/new"))
const GalleryEditPage = lazy(() => import("../../pages/shared/gallery/edit"))

const TripListPage = lazy(() => import("../../pages/shared/trip/list"))
const TripCreatePage = lazy(() => import("../../pages/shared/trip/new"))
const TripEditPage = lazy(() => import("../../pages/shared/trip/edit"))

const CourseListPage = lazy(() => import("../../pages/shared/course/list"))
const CourseCreatePage = lazy(() => import("../../pages/shared/course/new"))
const CourseEditPage = lazy(() => import("../../pages/shared/course/edit"))

const RentalListPage = lazy(() => import("../../pages/shared/rental/list"))
const RentalCreatePage = lazy(() => import("../../pages/shared/rental/new"))
const RentalEditPage = lazy(() => import("../../pages/shared/rental/edit"))

const BookingPage = lazy(() => import("../../pages/shared/booking/index"))

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

  {
    path: "booking",
    element: (
      <AuthGuard allowedRoles={["admin", "staff"]}>
        {role === "admin" ? (
          <Suspense fallback={<Spinner />}>
            <DashboardLayout>
              <BookingPage />
            </DashboardLayout>
          </Suspense>
        ) : role === "staff" ? (
          <Suspense fallback={<Spinner />}>
            <StaffLayout>
              <BookingPage />
            </StaffLayout>
          </Suspense>
        ) : null}
      </AuthGuard>
    ),
  },

  // gallery ...........
  {
    path: paths.shared.gallery.list,
    element: (
      <AuthGuard allowedRoles={["admin", "staff"]}>
        {role === "admin" ? (
          <Suspense fallback={<Spinner />}>
            <DashboardLayout>
              <GalleryListPage />
            </DashboardLayout>
          </Suspense>
        ) : role === "staff" ? (
          <Suspense fallback={<Spinner />}>
            <StaffLayout>
              <GalleryListPage />
            </StaffLayout>
          </Suspense>
        ) : null}
      </AuthGuard>
    ),
  },

  {
    path: paths.shared.gallery.new,
    element: (
      <AuthGuard allowedRoles={["admin", "staff"]}>
        {role === "admin" ? (
          <Suspense fallback={<Spinner />}>
            <DashboardLayout>
              <GalleryCreatePage />
            </DashboardLayout>
          </Suspense>
        ) : role === "staff" ? (
          <Suspense fallback={<Spinner />}>
            <StaffLayout>
              <GalleryCreatePage />
            </StaffLayout>
          </Suspense>
        ) : null}
      </AuthGuard>
    ),
  },

  {
    path: paths.shared.gallery.edit(":id"), // Use ":id" as a dynamic parameter
    element: (
      <AuthGuard allowedRoles={["admin", "staff"]}>
        {role === "admin" ? (
          <Suspense fallback={<Spinner />}>
            <DashboardLayout>
              <GalleryEditPage />
            </DashboardLayout>
          </Suspense>
        ) : role === "staff" ? (
          <Suspense fallback={<Spinner />}>
            <StaffLayout>
              <GalleryEditPage />
            </StaffLayout>
          </Suspense>
        ) : null}
      </AuthGuard>
    ),
  },
  // gallery ...........

  // trip ...........
  {
    path: paths.shared.trip.list,
    element: (
      <AuthGuard allowedRoles={["admin", "staff"]}>
        {role === "admin" ? (
          <Suspense fallback={<Spinner />}>
            <DashboardLayout>
              <TripListPage />
            </DashboardLayout>
          </Suspense>
        ) : role === "staff" ? (
          <Suspense fallback={<Spinner />}>
            <StaffLayout>
              <TripListPage />
            </StaffLayout>
          </Suspense>
        ) : null}
      </AuthGuard>
    ),
  },
  {
    path: paths.shared.trip.new,
    element: (
      <AuthGuard allowedRoles={["admin", "staff"]}>
        {role === "admin" ? (
          <Suspense fallback={<Spinner />}>
            <DashboardLayout>
              <TripCreatePage />
            </DashboardLayout>
          </Suspense>
        ) : role === "staff" ? (
          <Suspense fallback={<Spinner />}>
            <StaffLayout>
              <TripCreatePage />
            </StaffLayout>
          </Suspense>
        ) : null}
      </AuthGuard>
    ),
  },
  {
    path: paths.shared.trip.edit(":id"), // Use ":id" as a dynamic parameter
    element: (
      <AuthGuard allowedRoles={["admin", "staff"]}>
        {role === "admin" ? (
          <Suspense fallback={<Spinner />}>
            <DashboardLayout>
              <TripEditPage />
            </DashboardLayout>
          </Suspense>
        ) : role === "staff" ? (
          <Suspense fallback={<Spinner />}>
            <StaffLayout>
              <TripEditPage />
            </StaffLayout>
          </Suspense>
        ) : null}
      </AuthGuard>
    ),
  },
  // trip ...........

  // course ...........
  {
    path: paths.shared.course.list,
    element: (
      <AuthGuard allowedRoles={["admin", "staff"]}>
        {role === "admin" ? (
          <Suspense fallback={<Spinner />}>
            <DashboardLayout>
              <CourseListPage />
            </DashboardLayout>
          </Suspense>
        ) : role === "staff" ? (
          <Suspense fallback={<Spinner />}>
            <StaffLayout>
              <CourseListPage />
            </StaffLayout>
          </Suspense>
        ) : null}
      </AuthGuard>
    ),
  },
  {
    path: paths.shared.course.new,
    element: (
      <AuthGuard allowedRoles={["admin", "staff"]}>
        {role === "admin" ? (
          <Suspense fallback={<Spinner />}>
            <DashboardLayout>
              <CourseCreatePage />
            </DashboardLayout>
          </Suspense>
        ) : role === "staff" ? (
          <Suspense fallback={<Spinner />}>
            <StaffLayout>
              <CourseCreatePage />
            </StaffLayout>
          </Suspense>
        ) : null}
      </AuthGuard>
    ),
  },
  {
    path: paths.shared.course.edit(":id"), // Use ":id" as a dynamic parameter
    element: (
      <AuthGuard allowedRoles={["admin", "staff"]}>
        {role === "admin" ? (
          <Suspense fallback={<Spinner />}>
            <DashboardLayout>
              <CourseEditPage />
            </DashboardLayout>
          </Suspense>
        ) : role === "staff" ? (
          <Suspense fallback={<Spinner />}>
            <StaffLayout>
              <CourseEditPage />
            </StaffLayout>
          </Suspense>
        ) : null}
      </AuthGuard>
    ),
  },
  // course ...........

  // rental ...........
  {
    path: paths.shared.rental.list,
    element: (
      <AuthGuard allowedRoles={["admin", "staff"]}>
        {role === "admin" ? (
          <Suspense fallback={<Spinner />}>
            <DashboardLayout>
              <RentalListPage />
            </DashboardLayout>
          </Suspense>
        ) : role === "staff" ? (
          <Suspense fallback={<Spinner />}>
            <StaffLayout>
              <RentalListPage />
            </StaffLayout>
          </Suspense>
        ) : null}
      </AuthGuard>
    ),
  },
  {
    path: paths.shared.rental.new,
    element: (
      <AuthGuard allowedRoles={["admin", "staff"]}>
        {role === "admin" ? (
          <Suspense fallback={<Spinner />}>
            <DashboardLayout>
              <RentalCreatePage />
            </DashboardLayout>
          </Suspense>
        ) : role === "staff" ? (
          <Suspense fallback={<Spinner />}>
            <StaffLayout>
              <RentalCreatePage />
            </StaffLayout>
          </Suspense>
        ) : null}
      </AuthGuard>
    ),
  },
  {
    path: paths.shared.rental.edit(":id"), // Use ":id" as a dynamic parameter
    element: (
      <AuthGuard allowedRoles={["admin", "staff"]}>
        {role === "admin" ? (
          <Suspense fallback={<Spinner />}>
            <DashboardLayout>
              <RentalEditPage />
            </DashboardLayout>
          </Suspense>
        ) : role === "staff" ? (
          <Suspense fallback={<Spinner />}>
            <StaffLayout>
              <RentalEditPage />
            </StaffLayout>
          </Suspense>
        ) : null}
      </AuthGuard>
    ),
  },
  // rental ...........

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
