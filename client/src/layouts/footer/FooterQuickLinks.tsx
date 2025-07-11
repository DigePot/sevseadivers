import React from "react";
import { footerLinks } from "./footer.config";
import { Link } from "react-router-dom";

const FooterQuickLinks: React.FC = () => (
  <nav>
    <h3 className="font-semibold mb-2 text-cyan-700">Quick Links</h3>
    <ul className="space-y-2">
      {footerLinks.map((link) => (
        <li key={link.label}>
          <Link
            to={link.href}
            className="text-gray-500 hover:text-cyan-500 transition"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

export default FooterQuickLinks; 