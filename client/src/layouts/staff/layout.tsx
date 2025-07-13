import React, { useState, useEffect, type ReactNode, useCallback } from "react"
import { Link, useLocation } from "react-router-dom"
import { navData, type NavItem } from "../nav-config-staff"
import clsx from "clsx"
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiChevronDown,
  FiChevronUp,
  FiBell,
  FiUser,
  FiSettings,
} from "react-icons/fi"
import { CONFIG } from "../../global-config"
import { useLogout, useUser } from "../../sections/auth/hooks"

// Custom hook to handle media query for responsiveness
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = () => setMatches(media.matches)
    window.addEventListener("resize", listener)

    return () => window.removeEventListener("resize", listener)
  }, [query])

  return matches
}

interface StaffLayoutProps {
  children: ReactNode
}

export const StaffLayout: React.FC<StaffLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>(null)
  const { pathname } = useLocation()
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const { handleLogout } = useLogout()
  const id = localStorage.getItem("id") ?? ""
  const { user } = useUser(id)

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (!isDesktop) {
      setIsSidebarOpen(false)
    }
  }, [pathname, isDesktop])

  // Set active section based on current route
  useEffect(() => {
    const active = navData
      .flatMap((section) => section.items)
      .find(
        (item) =>
          item.path === pathname ||
          item.children?.some((child) => pathname.startsWith(child.path))
      )
    setOpenSection(active?.title || null)
  }, [pathname])

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev)
  }, [])

  const handleSectionClick = useCallback((sectionTitle: string) => {
    setOpenSection((prev) => (prev === sectionTitle ? null : sectionTitle))
  }, [])

  const handleSignOut = () => {
    console.log("Signing out...")
    handleLogout()
  }

  // Renders the navigation items
  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => {
      const isActive = pathname === item.path
      const isParentActive = item.children?.some((child) =>
        pathname.startsWith(child.path)
      )
      const isOpen = openSection === item.title
      const hasChildren = item.children && item.children.length > 0

      return (
        <li key={item.title} className="mb-1">
          {hasChildren ? (
            <>
              <div
                className={clsx(
                  "flex justify-between items-center p-3 rounded-lg cursor-pointer transition-colors duration-200",
                  "text-slate-800 font-medium hover:bg-white/40",
                  { "bg-white/40": isParentActive || isOpen }
                )}
                onClick={() => handleSectionClick(item.title)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.title}</span>
                </div>
                <span className="text-sm">
                  {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                </span>
              </div>

              {isOpen && (
                <ul className="pl-12 mt-1 space-y-1">
                  {item.children!.map((child) => {
                    const isChildActive = pathname === child.path
                    return (
                      <li key={child.title}>
                        <Link
                          to={child.path}
                          className={clsx(
                            "block py-2 px-3 rounded-md transition-colors duration-200 text-slate-700 hover:bg-white/30",
                            { "bg-white/50 font-semibold": isChildActive }
                          )}
                        >
                          {child.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </>
          ) : (
            <Link
              to={item.path}
              className={clsx(
                "flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 font-medium hover:bg-white/40",
                { "bg-white/40": isActive },
                "text-slate-800"
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.title}</span>
            </Link>
          )}
        </li>
      )
    })
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && !isDesktop && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 z-20"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "w-64 bg-[#20C2F8] bg-opacity-70 h-full fixed inset-y-0 left-0 z-30 transition-transform duration-300 ease-in-out",
          "flex flex-col shadow-lg",
          {
            "translate-x-0": isSidebarOpen,
            "-translate-x-full": !isSidebarOpen,
            "md:translate-x-0": isDesktop,
          }
        )}
      >
        <div className="flex justify-between items-center p-4 border-b border-white/30 flex-shrink-0">
          <Link
            className="flex items-center space-x-2 text-xl font-bold text-cyan-600 font-sans"
            to="/"
          >
            {/* Wave emoji icon */}
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 text-2xl">
              🌊
            </span>
            <span>{CONFIG.appName}</span>
          </Link>
          <button
            onClick={toggleSidebar}
            className="md:hidden text-2xl text-slate-800"
          >
            <FiX />
          </button>
        </div>

        <nav className="flex-grow p-3 space-y-2 overflow-y-auto">
          {navData.map((section) => (
            <div key={section.subheader} className="mb-4">
              <h2 className="text-slate-700 text-xs font-bold uppercase tracking-wider px-3 py-2">
                {section.subheader}
              </h2>
              <ul className="space-y-1">{renderNavItems(section.items)}</ul>
            </div>
          ))}
        </nav>

        {/* Sign Out Button */}
        <div className="p-3 border-t border-white/30 bg-[#20C2F8] bg-opacity-70">
          <button
            onClick={handleSignOut}
            className="flex items-center cursor-pointer w-full gap-3 p-3 rounded-lg transition-colors duration-200 text-slate-800 font-medium bg-[#1AB2E5] hover:bg-[#1AB2E5]/90 hover:text-white"
          >
            <FiLogOut className="text-xl" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={clsx(
          "flex-1 flex flex-col min-h-0 transition-all duration-300",
          {
            "md:ml-64": isDesktop,
          }
        )}
      >
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-10">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="text-gray-600 text-2xl mr-4 hidden md:block lg:hidden"
            >
              <FiMenu />
            </button>
            <Link
              className="flex items-center space-x-2 text-xl font-bold text-cyan-600 font-sans"
              to="/"
            >
              <span>{CONFIG.appName}</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* <button className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
              <FiBell className="text-xl" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button> */}

            {/* <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
              <FiSettings className="text-xl" />
            </button> */}

            <div className="flex items-center cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <FiUser className="text-blue-600" />
              </div>
              <span className="ml-2 font-medium text-slate-800 hidden lg:inline">
                {user?.username}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center p-4 bg-white shadow-sm sticky top-0 z-10">
          <button onClick={toggleSidebar} className="text-gray-600 text-2xl">
            <FiMenu />
          </button>
          <Link
            className="flex items-center space-x-2 text-xl font-bold text-cyan-600 font-sans"
            to="/"
          >
            <span>{CONFIG.appName}</span>
          </Link>
        </div>

        <main className="flex-1 overflow-auto p-4 bg-white md:bg-transparent">
          <div className="w-full max-w-full bg-white rounded-xl shadow-sm p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
