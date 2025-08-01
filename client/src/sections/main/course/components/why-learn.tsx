import { motion } from "framer-motion";
import { Link } from "react-router";

export const WhyLearnUs = () => {
  const reasons = [
    "Certified instructors",
    "Clean, modern gear",
    "Somali & English instruction available",
    "Located on safe, scenic Jazeera Beach",
    "Small group sizes for personal attention"
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen w-full bg-gradient-to-br from-cyan-500 to-[#22B1F7] py-20 px-4 mt-8 rounded-lg"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Column - Image Section */}
          <motion.div 
            className="w-full lg:w-1/2"
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[350px] lg:h-[600px]">
              {/* image */}
               <img 
                src="images/course-banner.png" 
                alt="Diving course banner"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#314985]/30 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            </div>
          </motion.div>
            

          {/* Right Column - Content Section */}
          <div className="w-full lg:w-1/2 text-white">
            {/* Header */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8 lg:mb-12" 
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                <span className="block">World-Class</span>
                <span className="block">Diving Education</span>
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-white/80 to-white rounded-full mt-6"></div>
            </motion.div>

            {/* Features List */}
            <motion.ul 
              className="space-y-4 lg:space-y-6 mb-8 lg:mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, staggerChildren: 0.1 }}
            >
              {reasons.map((reason, index) => (
                <motion.li
                  key={index}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                   className="flex items-start bg-white/10 backdrop-blur-sm p-3 lg:p-4 rounded-xl border border-white/20"
                >
                  <div className="bg-white p-1.5 lg:p-2 rounded-lg mr-3 lg:mr-4 flex-shrink-0">
                    <svg 
                      className="text-[#314985]" 
                      width="20" 
                      height="20" 
                      fill="currentColor" 
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>
                  </div>
                  <span className="text-base lg:text-lg font-medium">{reason}</span>
                </motion.li>
              ))}
            </motion.ul>

            {/* CTA Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <Link to="/contact-us" className="block w-full">
                <button className="bg-white hover:bg-white/90 text-[#314985] font-semibold py-3 lg:py-4 px-8 lg:px-10 rounded-lg text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  Want to learn more ?
                  <span className="ml-2">→</span>
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};