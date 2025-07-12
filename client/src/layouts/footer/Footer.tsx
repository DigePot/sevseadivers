import React from "react";
import { FaInstagram, FaFacebook, FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { footerLinks, footerSocials } from "./footer.config";

const products = [
  { label: "Diving Courses", href: "/courses" },
  { label: "Equipment Rental", href: "/services" },
  { label: "Guided Tours", href: "/trips" },
  { label: "Certification", href: "/services" },
];

const usefulLinks = [
  { label: "Your Account", href: "/auth/sign-in" },
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Help", href: "/help" },
];

const Footer: React.FC = () => (
  <footer className="bg-[#EAF7FB]">
    {/* Top Bar */}
    <div className="bg-[#1AB2E5] text-white py-3 px-4 flex flex-col md:flex-row items-center justify-between">
      <span className="mb-2 md:mb-0 text-center md:text-left font-medium">Get connected with us on social networks!</span>
      <div className="flex gap-4 justify-center">
        <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200 text-2xl"><FaFacebook /></a>
        <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200 text-2xl"><FaTwitter /></a>
        <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200 text-2xl"><FaInstagram /></a>
      </div>
    </div>
    {/* Main Footer */}
    <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Company Info */}
      <div>
        <h3 className="font-bold text-lg mb-3 text-[#1AB2E5]">SEVSEA DIVERS</h3>
        <p className="text-black text-sm mb-2">Here you can use rows and columns to organize your footer content. Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
      </div>
      {/* Products */}
      <div>
        <h3 className="font-bold text-lg mb-3 text-[#1AB2E5]">PRODUCTS</h3>
        <ul className="space-y-2">
          {products.map((item) => (
            <li key={item.label}>
              <a href={item.href} className="hover:text-[#1AB2E5] text-black">{item.label}</a>
            </li>
          ))}
        </ul>
      </div>
      {/* Useful Links */}
      <div>
        <h3 className="font-bold text-lg mb-3 text-[#1AB2E5]">USEFUL LINKS</h3>
        <ul className="space-y-2">
          {usefulLinks.map((item) => (
            <li key={item.label}>
              <a href={item.href} className="hover:text-[#1AB2E5] text-black">{item.label}</a>
            </li>
          ))}
        </ul>
      </div>
      {/* Contact */}
      <div>
        <h3 className="font-bold text-lg mb-3 text-[#1AB2E5]">CONTACT</h3>
        <ul className="space-y-2 text-black text-sm">
          <li className="flex items-center gap-2"><FaMapMarkerAlt /> 123 Ocean Drive, Beach City</li>
          <li className="flex items-center gap-2"><FaEnvelope /> info@sevsea.com</li>
          <li className="flex items-center gap-2"><FaPhone /> +1 (555) 123-4567</li>
        </ul>
      </div>
    </div>
    {/* Bottom Bar */}
    <div className="bg-[#EAF7FB] text-center text-xs text-black py-4">
      &copy; {new Date().getFullYear()} Sevsea Divers. All rights reserved.
    </div>
  </footer>
);

export default Footer; 