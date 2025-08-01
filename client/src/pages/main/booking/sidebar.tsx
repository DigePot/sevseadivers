import React from "react"
import { useLocation, useNavigate } from "react-router"
import { Link } from "react-router"

interface SidebarLink {
  label: string
  path: string
  icon: React.ReactNode
}

interface SidebarProps {
  isExpanded: boolean
  toggleSidebar: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, toggleSidebar }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const sidebarLinks: SidebarLink[] = [
    {
      label: "My Bookings",
      path: "/mybooking",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
      ),
    },
    {
      label: "Home",
      path: "/",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
    },
    {
      label: "Explore Trips",
      path: "/trips",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      label: "Profile",
      path: "/profile",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <aside
      className={`bg-cyan-200 border-r border-gray-200 flex flex-col py-8 px-4 transition-all duration-300 ease-in-out ${
        isExpanded ? "w-64" : "w-20"
      }`}
    >
      <div className="flex items-center justify-between mb-8">
        {isExpanded && (
          <Link
            to="/"
            className="text-2xl font-bold text-cyan-700 hover:text-cyan-800"
          >
            Dashboard
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 text-cyan-700 transform transition-transform ${
              isExpanded ? "" : "rotate-180"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isExpanded ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
            />
          </svg>
        </button>
      </div>

      <nav className="flex flex-col gap-2">
        {sidebarLinks.map((link) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className={`flex items-center text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
              isActive(link.path)
                ? "bg-cyan-100 text-cyan-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            title={link.label}
          >
            <span className={isExpanded ? "mr-3" : ""}>{link.icon}</span>
            {isExpanded && link.label}
          </button>
        ))}
      </nav>

      {/* Optional: Add user profile at bottom */}
      {isExpanded && (
        <div className="mt-auto pt-6 border-t border-gray-200">
          <div className="flex items-center">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">John Doe</p>
              <p className="text-xs text-gray-500">john@example.com</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}

export default Sidebar
