import { motion } from "framer-motion";
import { FaUsers, FaUser } from "react-icons/fa";
import { team } from "../data/team";

export default function TeamSection() {
  return (
    <motion.section
      className="py-20 px-6 bg-white text-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {/* Header */}
      <div className="flex justify-center mb-4">
        <FaUsers className="text-cyan-600 text-4xl" />
      </div>
      <h2 className="text-4xl font-extrabold mb-12 text-gray-900">Meet Our Team</h2>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
        {team.map((member, index) => (
          <motion.div
            key={index}
            className="bg-gray-50 rounded-2xl shadow-md overflow-hidden cursor-pointer
                       hover:shadow-2xl transition-shadow duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <div className="w-full h-72 flex items-center justify-center bg-gradient-to-tr from-cyan-300 to-indigo-400">
              {member.imageUrl ? (
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-36 h-36 object-cover rounded-full border-4 border-white shadow-lg"
                />
              ) : (
                <FaUser className="text-white text-7xl" />
              )}
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-gray-900">{member.name}</h3>
              <p className="text-cyan-600 font-medium mt-1">{member.role}</p>
              {member.bio && (
                <p className="text-gray-600 text-sm mt-3 leading-relaxed">{member.bio}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
