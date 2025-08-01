import React, { useState } from "react";
import { motion } from "framer-motion";

export const TripsHeader: React.FC = () => {
  const [imgLoaded, setImgLoaded] = useState(true);

  return (
    <section className="relative overflow-hidden min-h-[300px] md:min-h-[400px] lg:min-h-[500px] flex items-center justify-center">
      {/* Fallback gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-800 to-blue-900" />

      {/* Background image */}
      {imgLoaded && (
        <img
          src="/images/trip-banner.jpg"
          alt="Scuba divers exploring Somali reef"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
          onError={() => {
            console.warn("Banner image failed to load; using gradient fallback.");
            setImgLoaded(false);
          }}
        />
      )}

      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/30" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight"
        >
          Dive With <span className="text-cyan-300">SEVSEA DIVERS</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto"
        >
          Discover the underwater beauty of Somalia like never before.
        </motion.p>
      </div>

      {/* Responsive down arrow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2"
      >
        <a
          href="#trips"
          aria-label="Scroll down"
          className="group flex flex-col items-center"
        >
          <motion.div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/50 flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              y: [0, 8, 0], // Reduced bounce height for mobile
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-cyan-300 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
          <motion.span 
            className="mt-1 sm:mt-2 text-xs sm:text-sm text-white/80 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            Explore Trips
          </motion.span>
        </a>
      </motion.div>

      {/* Subtle water-like blobs */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-cyan-400 mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-blue-400 mix-blend-multiply filter blur-3xl opacity-15 pointer-events-none" />
    </section>
  );
};