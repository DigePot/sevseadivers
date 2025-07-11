
import { motion } from "framer-motion";
import { FaUsers, FaUser } from "react-icons/fa";
import { team } from "../data/team";

export default function TeamSection() {
  return (
    <motion.section
      className="py-16 px-4 bg-white text-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="flex justify-center mb-2">
        <FaUsers className="text-cyan-600 text-3xl" />
      </div>
      <h2 className="text-3xl font-bold mb-10">Meet Our Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {team.map((member, index) => (
          <motion.div
            key={index}
            className="bg-gray-50 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            viewport={{ once: true }}
          >
            <div className="w-full h-64 flex items-center justify-center bg-cyan-100">
              {member.imageUrl ? (
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-32 h-32 object-cover rounded-full"
                />
              ) : (
                <FaUser className="text-cyan-600 text-6xl" />
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{member.role}</p>
              {member.bio && <p className="text-gray-500 text-sm mt-2">{member.bio}</p>}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
} 