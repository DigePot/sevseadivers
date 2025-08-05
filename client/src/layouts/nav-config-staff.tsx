import type { JSX } from "react"
import {
  FiBookmark,
  FiBookOpen,
  FiGlobe,
  FiImage,
  FiTool,
  FiUser,
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
    subheader: "Management",
    items: [
      {
        title: "Booking",
        path: paths.shared.booking,
        icon: <FiBookmark />,
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
        title: "Gallery",
        path: paths.shared.gallery.list,
        icon: <FiImage />,
        children: [
          { title: "List", path: paths.shared.gallery.list },
          { title: "Create", path: paths.shared.gallery.new },
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
        title: "Equipment Rental",
        path: paths.shared.rental.root,
        icon: <FiTool />,
        children: [
          { title: "List", path: paths.shared.rental.list },
          { title: "Create", path: paths.shared.rental.new },
        ],
      },
      {
        title: "Profile",
        path: paths.shared.root,
        icon: <FiUser />,
      },
    ],
  },
]
