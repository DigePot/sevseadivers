import React from "react";
import TabHeader from "./tab-header";
import { motion, AnimatePresence } from "framer-motion";

interface AuthWrapperProps {
  activeTab: "signIn" | "signUp";
  handleTabChange: (tab: "signIn" | "signUp") => void;
  signInContent: React.ReactNode;
  signUpContent: React.ReactNode;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.97 },
};

const AuthWrapper: React.FC<AuthWrapperProps> = ({
  activeTab,
  handleTabChange,
  signInContent,
  signUpContent,
}) => {
  return (
    <div
      className="relative flex items-center justify-center min-h-screen px-6 md:px-20 py-12 overflow-hidden"
      aria-live="polite"
    >
      {/* Background animated gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-animated"
      />

      {/* Glassmorphism card */}
      <motion.div
        className="relative z-10 w-full max-w-4xl bg-white bg-opacity-10 backdrop-blur-md
          rounded-3xl p-10 md:p-14 shadow-xl border border-white border-opacity-20
          hover:shadow-2xl transition-shadow duration-500 ease-in-out"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <TabHeader activeTab={activeTab} onTabChange={handleTabChange} />

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="mt-10"
          >
            {activeTab === "signIn" ? signInContent : signUpContent}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AuthWrapper;
