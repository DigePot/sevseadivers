const ROOTS = {
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
  STAFF: "/staff-dashboard",
}

// ----------------------------------------------------------------------

export const paths = {
  about: "/about-us",
  contact: "/contact-us",
  forbidden: "/forbidden",
  // AUTH
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/sign-in`,
      signUp: `${ROOTS.AUTH}/sign-up`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      analytic: `${ROOTS.DASHBOARD}/analytic`,
      report: `${ROOTS.DASHBOARD}/report`,
    },
    staff: {
      root: `${ROOTS.DASHBOARD}/staff`,
      new: `${ROOTS.DASHBOARD}/staff/new`,
      list: `${ROOTS.DASHBOARD}/staff/list`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/staff/${id}/edit`,
    },
  },
  // STAFF
  staff: {
    root: `${ROOTS.STAFF}`,
    myCourses: `${ROOTS.STAFF}/my-courses`,
  },
  // SHARED
  shared: {
    root: `/profile`,
    booking: `/booking`,
    gallery: {
      root: `/gallery`,
      new: `/gallery/new`,
      list: `/gallery/list`,
      edit: (id: string) => `/gallery/${id}/edit`,
    },
    trip: {
      root: `/trip`,
      new: `/trip/new`,
      list: `/trip/list`,
      edit: (id: string) => `/trip/${id}/edit`,
    },
    course: {
      root: `/course`,
      new: `/course/new`,
      list: `/course/list`,
      edit: (id: string) => `/course/${id}/edit`,
    },
    rental: {
      root: `${ROOTS.DASHBOARD}/rental`,
      new: `${ROOTS.DASHBOARD}/rental/new`,
      list: `${ROOTS.DASHBOARD}/rental/list`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/rental/${id}/edit`,
    },
  },
  // MAIN
  main: {
    root: "/",
    courses: `/courses`,
    about: `/about-us`,
    trips: `/trips`,
    services: `/services`,
    gallery: `/gallery`,
    contact: `/contact-us`,
    forgotPassword: `/forgot-password`,
    resetPassword: `/reset-password`,
    rental: `/rental`,
  },
  // Payment
  payment: {
    root: "/success",
    courses: `/cancel`,
  },
}
