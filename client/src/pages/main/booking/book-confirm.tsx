import React, { useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import type { RootState } from "../../../store"

import {
  FiInfo,
  FiLock,
  FiShield,
  FiPhone,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi"

import { motion, AnimatePresence } from "framer-motion"

const sections = [
  {
    id: "terms",
    title: "1. Terms & Conditions",
    icon: <FiInfo size={24} className="text-cyan-600" />,
    content: (
      <>
        <h5 className="font-semibold mb-2">a) Booking of Services</h5>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>All services must be booked at least 24 hours in advance.</li>
          <li>Bookings via online, email, phone, or WhatsApp.</li>
          <li>SEVSEA DIVERS reserves the right to postpone/cancel due to safety or weather.</li>
        </ul>

        <h5 className="font-semibold mt-5 mb-2">b) Payment</h5>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>Payments accepted via cash, Zaad, eDahab, or PayPal.</li>
          <li>Cancellations under 24 hours are non-refundable.</li>
        </ul>

        <h5 className="font-semibold mt-5 mb-2">c) Safety & Medical Requirements</h5>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>Medical questionnaire mandatory for all clients.</li>
          <li>No diving without doctor clearance if medical issues exist.</li>
        </ul>

        <h5 className="font-semibold mt-5 mb-2">d) Equipment Responsibility</h5>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>Use rented equipment with care.</li>
          <li>Loss/damage charged at replacement value.</li>
        </ul>
      </>
    ),
  },
  {
    id: "privacy",
    title: "2. Privacy Policy",
    icon: <FiLock size={24} className="text-cyan-600" />,
    content: (
      <div className="text-gray-700 space-y-2">
        <p>We collect essential info (name, contact, booking data) strictly for operational use.</p>
        <p>No selling or sharing of your personal data without your consent. Data stored securely.</p>
        <p>Website uses cookies to improve experience; you may accept or reject them.</p>
      </div>
    ),
  },
  {
    id: "cancellation",
    title: "3. Cancellation & Refund Policy",
    icon: <FiShield size={24} className="text-cyan-600" />,
    content: (
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>Cancel at least 24 hours before scheduled time.</li>
        <li>Late cancellations (&lt;24h) are non-refundable.</li>
        <li>SEVSEA DIVERS cancellations provide full refund or alternative schedule.</li>
      </ul>
    ),
  },
  {
    id: "contact",
    title: "4. Contact",
    icon: <FiPhone size={24} className="text-cyan-600" />,
    content: (
      <address className="not-italic space-y-2 text-gray-700">
        <p>SEVSEA DIVERS</p>
        <p>
          📧 Email:{" "}
          <a
            href="mailto:info@sevseadivers.com"
            className="text-cyan-700 underline hover:text-cyan-900 transition-colors"
          >
            info@sevseadivers.com
          </a>
        </p>
        <p>
          📞 Tel:{" "}
          <a
            href="tel:+252615225057"
            className="text-cyan-700 underline hover:text-cyan-900 transition-colors"
          >
            +252 615 225 057
          </a>
        </p>
        <p>📍 Headquarters: Mogadishu, Somalia</p>
      </address>
    ),
  },
]

const TermsAccordion: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null)

  const toggle = (id: string) => setOpenId(openId === id ? null : id)

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-3xl shadow-lg select-text">
      {sections.map(({ id, title, icon, content }) => (
        <div
          key={id}
          className="border border-cyan-300 rounded-2xl shadow-md overflow-hidden"
        >
          <button
            onClick={() => toggle(id)}
            className="w-full flex items-center justify-between px-6 py-5 bg-cyan-50 hover:bg-cyan-100 focus:outline-none focus:ring-4 focus:ring-cyan-300 transition"
            aria-expanded={openId === id}
            aria-controls={`${id}-content`}
            id={`${id}-header`}
          >
            <div className="flex items-center gap-3 font-semibold text-lg text-cyan-900">
              {icon}
              {title}
            </div>
            <div className="text-cyan-900">
              {openId === id ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
            </div>
          </button>

          <AnimatePresence initial={false}>
            {openId === id && (
              <motion.div
                key={id}
                id={`${id}-content`}
                role="region"
                aria-labelledby={`${id}-header`}
                initial="collapsed"
                animate="open"
                exit="collapsed"
                variants={{
                  open: { opacity: 1, height: "auto", marginTop: 8 },
                  collapsed: { opacity: 0, height: 0, marginTop: 0 },
                }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="px-6 pb-6 text-gray-700 text-base leading-relaxed"
              >
                {content}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

const BookConfirm: React.FC = () => {
  const selectedTrip = useSelector(
    (state: RootState) => state.booking.selectedTrip
  )
  const navigate = useNavigate()

  if (!selectedTrip) {
    return (
      <div className="max-w-md mx-auto p-8 mt-16 text-center bg-white rounded-xl shadow-lg">
        <div className="text-red-500 text-xl font-semibold mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-14 w-14 mx-auto mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          No trip selected
        </div>
        <p className="text-gray-600 mb-6">Please go back and choose a trip to book</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg transition-all"
        >
          Back to Trips
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto bg-gradient-to-br from-white to-cyan-50 rounded-3xl shadow-2xl p-8 my-14 border border-cyan-200">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-cyan-800 tracking-tight">
          Confirm Your Booking
        </h1>
        <p className="text-cyan-600 mt-3 text-lg font-medium">
          Review your trip details before payment
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-teal-500 mx-auto mt-5 rounded-full shadow-lg"></div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
        {selectedTrip.imageUrl && (
          <div className="relative h-72 overflow-hidden rounded-t-2xl">
            <img
              src={selectedTrip.imageUrl}
              alt={selectedTrip.title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent rounded-t-2xl"></div>
            <div className="absolute bottom-5 left-6 z-10">
              <h2 className="text-white text-3xl font-bold drop-shadow-lg">
                {selectedTrip.title}
              </h2>
              <div className="flex items-center mt-1 text-cyan-200 font-semibold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {selectedTrip.location}
              </div>
            </div>
          </div>
        )}

        <div className="p-7">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Trip Details</h3>
              <p className="text-gray-700 max-w-xl leading-relaxed">{selectedTrip.description}</p>
            </div>
            <div className="bg-cyan-50 px-6 py-4 rounded-xl text-center min-w-[140px] shadow-inner border border-cyan-300">
              <div className="text-cyan-600 text-sm font-semibold tracking-wide uppercase mb-1">
                Total Price
              </div>
              <div className="text-3xl font-extrabold text-cyan-700">${selectedTrip.price}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="border border-gray-300 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-default">
              <h3 className="font-semibold text-cyan-800 mb-4 flex items-center gap-2 text-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Date Information
              </h3>
              <div className="flex items-center text-gray-700 font-medium text-base">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-cyan-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {selectedTrip.date}
              </div>
            </div>

            <div className="border border-gray-300 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-default">
              <h3 className="font-semibold text-cyan-800 mb-4 flex items-center gap-2 text-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Location Details
              </h3>
              <div className="flex items-center text-gray-700 font-medium text-base">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-cyan-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
                {selectedTrip.destination}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-10">
            <TermsAccordion />
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 text-gray-700 hover:text-gray-900 font-semibold px-7 py-3 rounded-lg border border-gray-300 hover:border-gray-400 transition-shadow shadow-sm hover:shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Summary
            </button>

            <button
              onClick={() => navigate("/trips/payment")}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookConfirm
