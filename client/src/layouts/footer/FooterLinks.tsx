import React from "react";
import { footerLinks } from "./footer.config";
import { Link } from "react-router-dom";

const FooterLinks: React.FC = () => (
  <nav className="flex flex-wrap justify-center gap-4 mb-4">
    {footerLinks.map((link) => (
      <Link
        key={link.label}
        to={link.href}
        className="text-gray-400 hover:text-cyan-500 transition"
      >
        {link.label}
      </Link>
    ))}
  </nav>
);

export default FooterLinks; 