"use client"

import { motion, type Variants } from "framer-motion" 

// --- Step 1: Import your team images ---
// Make sure these paths and filenames are correct.
import MohamedAliAbdulleImg from "../../../assets/Images/CEO.png"
import AbdihakimMohamedOmarImg from "../../../assets/Images/instructor.png"
import AbdihakimMohamedAliImg from "../../../assets/Images/diver.png"
import SuhaylaAliAhmedImg from "../../../assets/Images/operationManager.png"
import QalbiAliJamacImg from "../../../assets/Images/captain.png"

const teamMembers = [
  {
    name: "Mohamed Ali Abdulle",
    role: "Founder & CEO",
    description:
      "Mohamed is the founder and CEO of SevSea Divers. He established the company to empower Somali youth with maritime skills and to promote sustainable coastal tourism. He leads the company’s vision and partnerships to make diving accessible for all.",
    imageUrl: MohamedAliAbdulleImg,
  },
  {
    name: "Abdihakim Mohamed Omar",
    role: "Dive Instructor",
    description:
      "Abdihakim has over 8 years of diving experience across East Africa and the Red Sea. He trains divers with patience and confidence, always prioritizing the safety and comfort of every diver.",
    imageUrl: AbdihakimMohamedOmarImg,
  },
  {
    name: "Abdihakim Mohamed Ali",
    role: "Diver & Underwater Videographer",
    description:
      "Abdihakim is a skilled diver with over 7 years of experience in underwater filming and photography. His passion for capturing marine life and diving moments creates stunning visual memories for guests and raises awareness about ocean conservation.",
    imageUrl: AbdihakimMohamedAliImg,
  },
  {
    name: "Suhayla Ali Ahmed",
    role: "Operations Manager",
    description:
      "Suhayla manages daily operations at SevSea Divers, ensuring that bookings, equipment preparation, and training coordination run smoothly. Her leadership is central to the team’s success.",
    imageUrl: SuhaylaAliAhmedImg,
  },
  {
    name: "Qalbi Ali Jamac",
    role: "Divemaster & Boat Captain",
    description:
      "Qalbi is an experienced divemaster and boat captain who ensures dive trips are safe, enjoyable, and well-coordinated. He knows the coastal waters well and guides divers with professionalism and care.",
    imageUrl: QalbiAliJamacImg,
  },
]

// Define animation variants for staggered appearance
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Stagger animation for each card
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
}

// --- Step 3: Create the Team Section Component ---
const TeamSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center text-gray-800 mb-2 sm:text-4xl"
        >
          Meet Our Team 🤝
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-gray-600 mb-12 max-w-2xl mx-auto"
        >
          The dedicated professionals who make every dive unforgettable.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-lg overflow-hidden text-center p-6 flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-200"
            >
              <img
                src={member.imageUrl || "/placeholder.svg"}
                alt={`Portrait of ${member.name}`}
                className="w-32 h-32 rounded-full object-cover mb-4 ring-4 ring-cyan-500 shadow-md"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
              <p className="font-semibold text-cyan-600 mb-3">{member.role}</p>
              <p className="text-sm text-gray-600 flex-grow">{member.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default TeamSection
