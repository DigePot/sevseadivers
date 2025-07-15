import React from "react";
import { footerSocials } from "./footer.config";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

const iconMap: Record<string, React.ElementType> = {
  instagram: FaInstagram,
  facebook: FaFacebook,
  twitter: FaTwitter,
};

const FooterSocials: React.FC = () => (
  <div className="flex justify-center gap-6 mb-4">
    {footerSocials.map((social, index) => {
      const iconKey = social.icon?.toLowerCase() || "";
      const Icon = iconMap[iconKey];
      return (
        <a
          key={social.label + index}  // hubi key unique yahay
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-cyan-500 text-2xl transition-transform transform hover:scale-110"
          aria-label={social.label}
        >
          {Icon ? <Icon /> : null}
        </a>
      );
    })}
  </div>
);

export default FooterSocials;
