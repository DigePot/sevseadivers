import { motion } from "framer-motion";

export const CoursesHeader = () => {
  return (
    <section
      className="max-w-7xl mx-auto px-6 py-16 text-center relative bg-gradient-to-b from-cyan-50 via-white to-cyan-100"
      aria-label="Courses at Sevsea Divers"
    >
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-5xl md:text-6xl font-extrabold text-cyan-700 mb-8 drop-shadow-lg tracking-tight"
      >
        Explore Our <span className="text-blue-600">Diving Courses</span>
      </motion.h1>

      {/* Subheading */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="max-w-3xl mx-auto text-gray-700 text-lg md:text-xl leading-relaxed mb-8 px-4 md:px-0"
      >
        Dive into a world of adventure! Our certified scuba and snorkeling courses are designed to help you explore the ocean with skill, confidence, and respect for the marine environment.
      </motion.p>
    </section>
  );
};
