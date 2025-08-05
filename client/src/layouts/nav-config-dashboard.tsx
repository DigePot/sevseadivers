import type { JSX } from "react"
import {
  FiBarChart,
  FiBookmark,
  FiBookOpen,
  FiFileText,
  FiGlobe,
  FiHome,
  FiImage,
  FiTool,
  FiUser,
  FiUsers,
} from "react-icons/fi"
import { paths } from "../routes/paths"

export interface NavItem {
  title: string
  path: string
  icon: JSX.Element
  children?: { title: string; path: string }[]
}

export interface NavSection {
  subheader: string
  items: NavItem[]
}

export const navData: NavSection[] = [
  {
    subheader: "Overview",
    items: [
      {
        title: "App",
        path: paths.dashboard.root,
        icon: <FiHome />,
      },
      {
        title: "Analytics",
        path: paths.dashboard.general.analytic,
        icon: <FiBarChart />,
      },
      {
        title: "Report",
        path: paths.dashboard.general.report,
        icon: <FiFileText />,
      },
    ],
  },
  {
    subheader: "Management",
    items: [
      {
        title: "Staff",
        path: paths.dashboard.staff.root,
        icon: <FiUsers />,
        children: [
          { title: "List", path: paths.dashboard.staff.list },
          { title: "Create", path: paths.dashboard.staff.new },
        ],
      },
      {
        title: "Trip",
        path: paths.shared.trip.root,
        icon: <FiGlobe />,
        children: [
          { title: "List", path: paths.shared.trip.list },
          { title: "Create", path: paths.shared.trip.new },
        ],
      },
      {
        title: "Course",
        path: paths.shared.course.root,
        icon: <FiBookOpen />,
        children: [
          { title: "List", path: paths.shared.course.list },
          { title: "Create", path: paths.shared.course.new },
        ],
      },
      {
        title: "Gallery",
        path: paths.shared.gallery.list,
        icon: <FiImage />,
        children: [
          { title: "List", path: paths.shared.gallery.list },
          { title: "Create", path: paths.shared.gallery.new },
        ],
      },
      {
        title: "Equipment Rental",
        path: paths.shared.rental.root,
        icon: <FiTool />,
        children: [
          { title: "List", path: paths.shared.rental.list },
          { title: "Create", path: paths.shared.rental.new },
        ],
      },
      {
        title: "Booking",
        path: paths.shared.booking,
        icon: <FiBookmark />,
      },
      {
        title: "Profile",
        path: paths.shared.root,
        icon: <FiUser />,
      },
    ],
  },
]
