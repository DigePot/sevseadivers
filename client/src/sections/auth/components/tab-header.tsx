import React from "react";
import { motion, LayoutGroup } from "framer-motion";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";

interface TabHeaderProps {
  activeTab: "signIn" | "signUp";
  onTabChange: (tab: "signIn" | "signUp") => void;
}

const tabs = [
  { key: "signIn", label: "Sign In", icon: <FaSignInAlt className="mr-2" aria-hidden="true" /> },
  { key: "signUp", label: "Sign Up", icon: <FaUserPlus className="mr-2" aria-hidden="true" /> },
];

const TabHeader: React.FC<TabHeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="text-center px-6 w-full max-w-xl mx-auto select-none">
      {/* Title */}
      <motion.h1
        className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-10 tracking-tight drop-shadow-lg"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        Welcome To <span className="text-cyan-600 drop-shadow-md">SEVSEA DIVERS</span>
      </motion.h1>

      {/* Tabs Container */}
      <LayoutGroup>
        <div className="relative inline-flex items-center p-2 bg-white border border-gray-300 rounded-full shadow-2xl overflow-hidden">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key as "signIn" | "signUp")}
                aria-selected={isActive}
                role="tab"
                tabIndex={isActive ? 0 : -1}
                className={`relative z-10 flex items-center px-8 py-3 text-lg font-bold rounded-full cursor-pointer transition-colors duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-500 focus-visible:ring-offset-4
                  ${isActive
                    ? "text-white"
                    : "text-gray-600 hover:text-cyan-600 hover:scale-110"
                  }`}
                style={{ userSelect: "none" }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    aria-hidden="true"
                  />
                )}
                <span className="relative flex items-center gap-3 pointer-events-none text-xl">
                  {tab.icon}
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
};

export default TabHeader;
