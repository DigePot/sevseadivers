import React, { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaBars,
  FaTimes,
  FaMoon,
  FaSun,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa"
import { SignInButton } from "../../components/sign-in-button"
import { SignOutButton } from "../../components/sign-out-button"
import { CONFIG } from "../../global-config"
import Footer from "../../layouts/footer/Footer"
import { useAuth, useUser } from "../../sections/auth/hooks"
import { navData as mainNavData } from "../nav-config-main"

interface MainLayoutProps {
  children: React.ReactNode
}

const SEARCH_SUGGESTIONS = [
  "Diving Courses",
  "Snorkeling Trips",
  "Equipment Rental",
  "Certification Programs",
  "Marine Conservation",
  "Boat Tours",
]

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const id = localStorage.getItem("id") ?? ""
  const { user } = useUser(id)
  const { authenticated } = useAuth()
  const navigate = useNavigate()

  // States
  const [menuOpen, setMenuOpen] = useState(false) // mobile nav menu
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode")
    if (stored !== null) return stored === "true"
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])

  // Refs for clicks outside detection
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Dark mode toggle with persistence
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
    localStorage.setItem("darkMode", darkMode.toString())
  }, [darkMode])

  // Filter search suggestions
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSuggestions([])
      setShowSuggestions(false)
      return
    }
    const filtered = SEARCH_SUGGESTIONS.filter((s) =>
      s.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredSuggestions(filtered)
    setShowSuggestions(filtered.length > 0)
  }, [searchTerm])

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node)
      ) {
        setProfileMenuOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
      // Close mobile menu if clicking outside? Optional
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setProfileMenuOpen(false)
        setShowSuggestions(false)
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEsc)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEsc)
    }
  }, [])

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto"
  }, [menuOpen])

  // Handlers
  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
      setShowSuggestions(false)
      setMenuOpen(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion)
    setShowSuggestions(false)
    navigate(`/search?q=${encodeURIComponent(suggestion)}`)
    setMenuOpen(false)
  }

  const handleProfileClick = () => {
    setProfileMenuOpen(false)
    setMenuOpen(false)
    navigate("/profile")
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-cyan-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 transition-colors duration-500">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between shadow-md">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 text-2xl font-extrabold text-cyan-600 font-sans select-none"
        >
          <motion.span
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-700 text-3xl shadow-inner"
            whileHover={{ rotate: 15, scale: 1.1 }}
          >
            🌊
          </motion.span>
          <span>SevSea Divers</span>
        </Link>

        {/* Desktop Nav + Search + DarkMode + Profile */}
        <nav className="hidden md:flex items-center gap-6 text-gray-900 dark:text-gray-200 max-w-5xl mx-auto px-4 md:px-0 flex-1">
          {/* Navigation Links */}
          <div className="flex space-x-6 font-semibold tracking-wide flex-shrink-0">
            {mainNavData.map(({ path, title }) => (
              <Link
                key={path}
                to={path}
                className="relative group px-2 py-1 transition text-lg text-gray-700 dark:text-gray-300 hover:text-cyan-600"
              >
                {title}
                <span className="absolute left-0 -bottom-1 w-0 h-1 bg-cyan-500 transition-all group-hover:w-full rounded"></span>
              </Link>
            ))}
          </div>

          {/* Search */}
          <div
            ref={searchRef}
            className="relative flex-1 max-w-xl ml-6"
            tabIndex={-1}
          >
            <form onSubmit={onSearchSubmit} role="search">
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 pl-10 pr-4 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                autoComplete="off"
                aria-autocomplete="list"
                aria-controls="search-suggestion-list"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
            </form>

            <AnimatePresence>
              {showSuggestions && (
                <motion.ul
                  id="search-suggestion-list"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-56 overflow-auto text-gray-900 dark:text-gray-100"
                  role="listbox"
                >
                  {filteredSuggestions.map((s) => (
                    <li
                      key={s}
                      onClick={() => handleSuggestionClick(s)}
                      className="cursor-pointer px-4 py-2 hover:bg-cyan-500 hover:text-white transition"
                      tabIndex={0}
                      role="option"
                    >
                      {s}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Dark Mode Toggle */}
          <motion.button
            onClick={() => setDarkMode((d) => !d)}
            className="ml-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-cyan-500 hover:text-white transition shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
          </motion.button>

          {/* Profile Menu */}
          <div className="relative ml-4" ref={profileMenuRef}>
            {authenticated ? (
              <>
                <motion.button
                  onClick={() => setProfileMenuOpen((p) => !p)}
                  className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 hover:rotate-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  whileTap={{ scale: 0.95 }}
                  aria-haspopup="true"
                  aria-expanded={profileMenuOpen}
                  title="User menu"
                >
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <FaUserCircle className="w-8 h-8 text-gray-500 dark:text-gray-300" />
                  )}
                </motion.button>

                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 overflow-hidden"
                    >
                      <button
                        onClick={handleProfileClick}
                        className="w-full px-4 py-3 text-left text-gray-700 dark:text-gray-200 hover:bg-cyan-500 hover:text-white transition"
                      >
                        Profile
                      </button>
                      <SignOutButton className="w-full px-4 py-3 text-white bg-cyan-600 hover:bg-cyan-700 transition rounded-b-lg">
                        Sign out
                      </SignOutButton>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <SignInButton />
            )}
          </div>
        </nav>

        {/* Mobile hamburger + dark mode + profile */}
        <div className="flex md:hidden items-center space-x-3">
          <motion.button
            onClick={() => setDarkMode((d) => !d)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-cyan-500 hover:text-white transition shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
          </motion.button>

          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-cyan-500 hover:text-white transition shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-16 right-0 w-64 h-screen bg-white dark:bg-gray-900 shadow-lg z-50 p-4 flex flex-col space-y-4"
          >
            {/* Mobile Search */}
            <div ref={searchRef} className="relative">
              <form onSubmit={onSearchSubmit} role="search">
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 pl-10 pr-4 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
                  autoComplete="off"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
              </form>

              <AnimatePresence>
                {showSuggestions && (
                  <motion.ul
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-56 overflow-auto text-gray-900 dark:text-gray-100"
                  >
                    {filteredSuggestions.map((s) => (
                      <li
                        key={s}
                        onClick={() => handleSuggestionClick(s)}
                        className="cursor-pointer px-4 py-2 hover:bg-cyan-500 hover:text-white transition"
                        tabIndex={0}
                      >
                        {s}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Nav Links */}
            <div className="flex flex-col space-y-3 font-semibold tracking-wide">
              {mainNavData.map(({ path, title }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-900 dark:text-gray-200 hover:text-cyan-600 transition text-lg"
                >
                  {title}
                </Link>
              ))}
            </div>

            {/* Mobile profile/sign-in buttons */}
            <div>
              {authenticated ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/profile")
                      setMenuOpen(false)
                    }}
                    className="w-full text-left block px-4 py-2 mb-2 text-gray-700 dark:text-gray-300 hover:bg-cyan-500 hover:text-white rounded transition"
                  >
                    Profile
                  </button>
                  <SignOutButton
                    className="w-full px-4 py-2 rounded-md bg-cyan-600 text-white hover:bg-cyan-700 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign out
                  </SignOutButton>
                </>
              ) : (
                <SignInButton
                  onClick={() => setMenuOpen(false)}
                  className="w-full px-4 py-2 rounded-md bg-cyan-600 text-white hover:bg-cyan-700 transition"
                />
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-12 bg-white dark:bg-gray-900 transition-colors duration-500">
        {children}
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  )
}
