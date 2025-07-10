const ROOTS = {
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
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
    trip: {
      root: `${ROOTS.DASHBOARD}/trip`,
      new: `${ROOTS.DASHBOARD}/trip/new`,
      list: `${ROOTS.DASHBOARD}/trip/list`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/trip/${id}/edit`,
    },
    course: {
      root: `${ROOTS.DASHBOARD}/course`,
      new: `${ROOTS.DASHBOARD}/course/new`,
      list: `${ROOTS.DASHBOARD}/course/list`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/course/${id}/edit`,
    },
    gallery: {
      root: `${ROOTS.DASHBOARD}/gallery`,
      new: `${ROOTS.DASHBOARD}/gallery/new`,
      list: `${ROOTS.DASHBOARD}/gallery/list`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/gallery/${id}/edit`,
    },
  },
}
