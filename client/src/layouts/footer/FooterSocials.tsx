import React from "react";
import { footerSocials } from "./footer.config";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

const iconMap: Record<string, React.ReactNode> = {
  instagram: <FaInstagram />,
  facebook: <FaFacebook />,
  twitter: <FaTwitter />,
};

const FooterSocials: React.FC = () => (
  <div className="flex justify-center gap-6 mb-4">
    {footerSocials.map((social) => (
      <a
        key={social.label}
        href={social.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-cyan-500 text-2xl transition"
        aria-label={social.label}
      >
        {iconMap[social.icon]}
      </a>
    ))}
  </div>
);

export default FooterSocials; 