import React, { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom" // Use react-router-dom
import { SignInButton } from "../../components/sign-in-button"
import { SignOutButton } from "../../components/sign-out-button"
import { CONFIG } from "../../global-config"
import Footer from "../../layouts/footer/Footer"
import { useAuth, useUser } from "../../sections/auth/hooks"
import { navData as mainNavData } from "../nav-config-main"

interface MainLayoutProps {
  children: React.ReactNode
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const id = localStorage.getItem("id") ?? ""
  const { user } = useUser(id)
  const { authenticated } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleProfileClick = () => {
    setMenuOpen(false)
    navigate("/profile")
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
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
        <nav className="flex items-center gap-4">
          <div className="space-x-2">
            {mainNavData.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-black text-base px-2 py-1 transition hover:underline hover:text-cyan-600"
              >
                {item.title}
              </Link>
            ))}
          </div>

          <div className="flex items-center relative" ref={menuRef}>
            {authenticated ? (
              <>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 cursor-pointer"
                >
                  {/* Display user image or a default icon */}
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      className="w-6 h-6 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  )}
                </button>
                {/* Dropdown Menu */}
                {menuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-md shadow-lg p-2 ring-1 ring-black ring-opacity-5 z-50 ">
                    <button
                      onClick={handleProfileClick}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      Profile
                    </button>
                    {/* <SignOutButton className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 mt-5" /> */}
                    <SignOutButton className="w-full inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-cyan-500 hover:bg-cyan-600 rounded transition mt-2">
                      <svg
                        className="w-4 h-4 mr-1 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign out
                    </SignOutButton>
                  </div>
                )}
              </>
            ) : (
              <SignInButton />
            )}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
