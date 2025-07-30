"use client"

import { motion, type Variants, type Transition } from "framer-motion"
import { CheckCircle2 } from "lucide-react"
import { Link } from "react-router-dom"

interface PricingPlan {
  title: string
  price: string
  period: string
  description: string
  features: string[]
  buttonText: string
  isPopular?: boolean
  buttonClass?: string
}

const pricingPlans: PricingPlan[] = [
  {
    title: "Free Diver",
    price: "$0.00",
    period: "/month",
    description: "Perfect for beginners to explore basic snorkeling and learn about marine life.",
    features: [
      "Basic Snorkeling Gear Rental",
      "Access to Online Marine Life Guides",
      "Community Forum Access",
      "Monthly Newsletter",
      "Introductory Safety Briefings",
    ],
    buttonText: "Start Free Trial",
  },
  {
    title: "Standard Explorer",
    price: "$99.00",
    period: "/month",
    description: "Ideal for enthusiasts ready to take their first guided dives and explore more.",
    features: [
      "Everything in Free",
      "Guided Reef Dives (2 per month)",
      "Basic Scuba Gear Rental",
      "Personalized Dive Planning",
      "Priority Booking for Popular Trips",
      "Discounts on Certification Courses",
    ],
    buttonText: "Sign Up for Standard",
    isPopular: true,
    buttonClass: "bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-300", // Cyan-600 for the popular button
  },
  {
    title: "Pro Adventurer",
    price: "$199.00",
    period: "/month",
    description: "For experienced divers seeking advanced challenges and exclusive expeditions.",
    features: [
      "Everything in Standard Explorer",
      "Unlimited Guided Dives",
      "Advanced Scuba Gear & Nitrox Rental",
      "Access to Exclusive Dive Sites",
      "One-on-One Instructor Sessions",
      "Expedited Certification Processing",
      "Integration with Dive Log Apps",
    ],
    buttonText: "Join Pro Adventurer",
  },
]

const PricingSection = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      } as Transition,
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } as Transition },
  }

  return (
    <section id="pricing" className="py-20 px-4 text-white relative overflow-hidden">
      {/* Subtle background pattern (optional, can be an image or generated) */}
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'url("/placeholder.svg?height=100&width=100")', backgroundSize: "100px 100px" }}
      ></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-center mb-4 text-cyan-400"
        >
          Simple and Affordable <br /> Pricing Plans
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-300 text-center mb-16 max-w-2xl mx-auto"
        >
          Choose the perfect plan to dive into the depths with Sevsea Divers.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative p-8 rounded-3xl shadow-2xl border border-gray-700 backdrop-blur-sm bg-gray-800/50 flex flex-col ${
                plan.isPopular ? "border-cyan-600 ring-2 ring-cyan-600" : ""
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              <h3 className="text-3xl font-bold text-white mb-4 text-center">{plan.title}</h3>
              <div className="text-center mb-6">
                <span className="text-5xl font-extrabold text-white">{plan.price}</span>
                <span className="text-xl text-gray-400">{plan.period}</span>
              </div>
              <p className="text-gray-300 text-center mb-8 flex-grow">{plan.description}</p>

              {/* Changed button to Link */}
              <Link
                to={`/trips/payment?plan=${encodeURIComponent(plan.title)}`}
                className={`w-full py-3 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg focus:outline-none focus:ring-4 text-center block ${
                  plan.buttonClass || "bg-gray-700 hover:bg-gray-600 focus:ring-gray-500"
                } text-white`}
              >
                {plan.buttonText}
              </Link>

              <div className="mt-8 pt-8 border-t border-gray-700">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 text-center">
                  Features
                </h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default PricingSection
