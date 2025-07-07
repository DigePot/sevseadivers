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
  },
}
