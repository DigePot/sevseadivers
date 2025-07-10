import type { JSX } from "react"
import {
  FiBarChart,
  FiBookmark,
  FiBookOpen,
  FiFileText,
  FiGlobe,
  FiHome,
  FiImage,
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
        path: paths.dashboard.trip.root,
        icon: <FiGlobe />,
        children: [
          { title: "List", path: paths.dashboard.trip.list },
          { title: "Create", path: paths.dashboard.trip.new },
        ],
      },
      {
        title: "Course",
        path: paths.dashboard.course.root,
        icon: <FiBookOpen />,
        children: [
          { title: "List", path: paths.dashboard.course.list },
          { title: "Create", path: paths.dashboard.course.new },
        ],
      },
      {
        title: "Gallery",
        path: paths.dashboard.gallery.root,
        icon: <FiImage />,
        children: [
          { title: "List", path: paths.dashboard.gallery.list },
          { title: "Create", path: paths.dashboard.gallery.new },
        ],
      },
      {
        title: "Booking",
        path: paths.dashboard.booking,
        icon: <FiBookmark />,
      },
    ],
  },
]
