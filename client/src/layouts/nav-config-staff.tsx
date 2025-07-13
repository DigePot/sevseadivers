import type { JSX } from "react"
import { FiBookmark, FiUser } from "react-icons/fi"
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
        path: paths.staff.root,
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
