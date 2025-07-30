"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "What types of diving adventures does Sevsea Divers offer?",
    answer:
      "Sevsea Divers offers a wide range of diving and snorkeling adventures, from thrilling deep-sea explorations to serene encounters with vibrant marine life. We provide guided tours, personalized adventures, and various courses tailored to all skill levels.",
  },
  {
    question: "Do I need prior diving experience to join your trips or courses?",
    answer:
      "Not at all! We offer beginner-friendly scuba lessons and courses designed for those with no prior experience. Our experienced instructors ensure a safe and comfortable learning environment, guiding you every step of the way.",
  },
  {
    question: "What kind of marine life can I expect to see?",
    answer:
      "Our expeditions take you to diverse underwater ecosystems where you can encounter a rich variety of marine life, including colorful coral reefs, tropical fish, sea turtles, rays, and sometimes even larger pelagic species, depending on the destination and season.",
  },
  {
    question: "Is your diving equipment safe and well-maintained?",
    answer:
      "Absolutely. We prioritize your safety above all else. Sevsea Divers uses state-of-the-art diving equipment that is regularly inspected and meticulously maintained to ensure the highest standards of safety and reliability for all our adventures.",
  },
  {
    question: "Do you offer diving certifications?",
    answer:
      "Yes, we do! We have a comprehensive Diver Training & Certification Portal where you can enroll in various courses to earn your diving certifications. Our programs are designed to streamline your path to becoming a certified diver.",
  },
  {
    question: "What is Sevsea Divers' approach to marine conservation?",
    answer:
      "We are deeply committed to marine conservation. All our diving experiences are conducted with an eco-conscious approach, emphasizing responsible interaction with marine environments and promoting awareness about ocean preservation. We strive to minimize our ecological footprint and support healthy marine ecosystems.",
  },
  {
    question: "How can I book an adventure or course?",
    answer:
      "You can easily book your next adventure or enroll in a course by visiting our 'Trips' page. There, you'll find detailed information about our offerings and a straightforward booking process.",
  },
]

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 px-4 text-white">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-center mb-4 text-cyan-400"
        >
          Frequently Asked Questions
        </motion.h2>
        <p className="text-lg text-gray-300 text-center mb-16 max-w-2xl mx-auto">
          Find answers to common questions about Sevsea Divers, our services, and your underwater adventures.
        </p>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700"
            >
              <button
                className="flex justify-between items-center w-full p-6 text-left text-xl font-semibold text-white hover:bg-gray-700 transition-colors duration-200"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                {faq.question}
                <motion.span animate={{ rotate: openIndex === index ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown className="w-6 h-6 text-cyan-400" />
                </motion.span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="px-6 pb-6 text-gray-300 leading-relaxed"
                  >
                    <p>{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQSection
