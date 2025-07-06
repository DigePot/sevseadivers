import { paths } from "../routes/paths"

export const navData = [
  {
    subheader: "Overview",
    items: [{ title: "App", path: paths.dashboard.root, icon: "" }],
  },
  {
    subheader: "Management",
    items: [
      {
        title: "Staff",
        path: paths.dashboard.user.root,
        icon: "",
        children: [
          { title: "List", path: paths.dashboard.user.list },
          { title: "Create", path: paths.dashboard.user.new },
        ],
      },
    ],
  },
]
