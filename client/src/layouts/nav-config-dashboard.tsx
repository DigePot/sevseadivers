import type { JSX } from "react"
import { FiGlobe, FiHome, FiUsers } from "react-icons/fi"
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
    ],
  },
  {
    subheader: "Management",
    items: [
      {
        title: "Staff",
        path: paths.dashboard.staff.root, // This path can be a placeholder or the list path
        icon: <FiUsers />,
        children: [
          { title: "List", path: paths.dashboard.staff.list },
          { title: "Create", path: paths.dashboard.staff.new },
        ],
      },
      {
        title: "Trip",
        path: paths.dashboard.trip.root, // This path can be a placeholder or the list path
        icon: <FiGlobe />,
        children: [
          { title: "List", path: paths.dashboard.trip.list },
          { title: "Create", path: paths.dashboard.trip.new },
        ],
      },
    ],
  },
]
