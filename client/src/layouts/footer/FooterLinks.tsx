import React from "react"
import { footerLinks } from "./footer.config"
import { Link } from "react-router"

const FooterLinks: React.FC = () => (
  <nav
    className="flex flex-wrap justify-center gap-6 mb-6"
    aria-label="Footer navigation"
  >
    {footerLinks.map(({ label, href }) => (
      <Link
        key={label}
        to={href}
        className="text-gray-400 hover:text-cyan-500 focus:text-cyan-500 focus:outline-none
                   transition-transform transform hover:scale-110 focus:scale-110
                   duration-300 font-medium"
        tabIndex={0}
      >
        {label}
      </Link>
    ))}
  </nav>
)

export default FooterLinks
