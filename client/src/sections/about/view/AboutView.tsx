
import { motion } from "framer-motion";
import MissionSection from "../components/mission-section";  //
import VisionSection from "../components/vision-section";
import TeamSection from "../components/team-section";
import StorySection from "../components/story-section";

export function AboutView() {
  return (
    <section
      className="max-w-7xl mx-auto px-6 py-16 text-center relative bg-gradient-to-b from-cyan-50 via-white to-cyan-100"
      aria-label="About Sevsea Divers"
    >
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-5xl md:text-6xl font-extrabold text-cyan-700 mb-8 drop-shadow-lg tracking-tight"
      >
        About <span className="text-blue-600">Sevsea Divers</span>
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="max-w-3xl mx-auto text-gray-700 text-lg md:text-xl leading-relaxed mb-16 px-4 md:px-0"
      >
        SEVSEA DIVERS is a Somali-based center offering safe and professional scuba diving,
        snorkeling, and marine tours. We were founded to inspire Somalis to explore the beauty of their seas
        while creating new job opportunities and skills for youth.
        <br />
        <br />
        We believe the ocean is a national treasure that deserves protection and sustainable development
        through training, tourism, and environmental awareness.
      </motion.p>

      <MissionSection />
      <VisionSection />
      <StorySection />
      <TeamSection />
    </section>
  );
}
