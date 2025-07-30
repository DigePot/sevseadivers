import React, { useState, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { AnimatePresence, motion } from "framer-motion"
import { FaChevronDown } from "react-icons/fa"

// --- SVG Flag Components (Self-contained and scalable) ---

const SomaliFlag = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 900 600"
    className="w-6 h-6 rounded-full object-cover"
    aria-hidden="true"
  >
    <rect width="900" height="600" fill="#4189DD" />
    <path
      d="M450 150l58.779 181.657h190.21l-153.89 112.26L599.1 556.18 450 443.82l-149.1 112.36 53.99-172.263-153.89-112.26h190.21L450 150z"
      fill="#fff"
    />
  </svg>
)

const EnglishFlag = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 7410 3900"
    className="w-6 h-6 rounded-full object-cover"
    aria-hidden="true"
  >
    <path fill="#b22234" d="M0 0h7410v3900H0z" />
    <path
      d="M0 450h7410M0 1350h7410M0 2250h7410M0 3150h7410"
      stroke="#fff"
      strokeWidth="300"
    />
    <path fill="#3c3b6e" d="M0 0h2964v2100H0z" />
    <g fill="#fff">
      <g id="s18">
        <g id="s9">
          <path
            id="s5"
            d="M0-420L136.8-130.9 400.6-130.9 181.8 62.1 247.2 342.3 0 130.9-247.2 342.3-181.8 62.1-400.6-130.9-136.8-130.9z"
          />
          <use href="#s5" y="840" />
          <use href="#s5" y="1680" />
        </g>
        <use href="#s9" x="494" />
      </g>
      <use href="#s18" x="988" />
      <use href="#s18" x="1976" />
      <use href="#s18" x="2964" />
    </g>
  </svg>
)

// --- Language Options Configuration ---

type LanguageOption = {
  code: "en" | "so"
  name: string
  flag: React.ComponentType
}

const languageOptions: LanguageOption[] = [
  { code: "en", name: "English", flag: EnglishFlag },
  { code: "so", name: "Soomaali", flag: SomaliFlag },
]

// --- The Main Language Switcher Component ---

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Find the currently selected language option
  const currentLanguage =
    languageOptions.find((lang) => lang.code === i18n.language) ||
    languageOptions[0]

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle language selection
  const handleSelectLanguage = (code: "en" | "so") => {
    i18n.changeLanguage(code)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* --- Trigger Button --- */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-between w-32 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-cyan-500 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center">
          <currentLanguage.flag />
          <span className="ml-3">{currentLanguage.name}</span>
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <FaChevronDown className="w-4 h-4 text-gray-400" />
        </motion.div>
      </motion.button>

      {/* --- Dropdown Panel --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden"
            role="listbox"
          >
            {languageOptions.map((option) => (
              <li
                key={option.code}
                onClick={() => handleSelectLanguage(option.code)}
                className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-600 transition-colors"
                role="option"
                aria-selected={i18n.language === option.code}
              >
                <option.flag />
                <span className="ml-3">{option.name}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LanguageSwitcher
