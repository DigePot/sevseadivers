import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { useSendContactMessageMutation } from "../../../../store/auth/auth"

// ---------------------------------------------------
// 2. Updated ContactView Component (ContactView.tsx)
// ---------------------------------------------------

// --- FIX 2: Type guard to safely check the structure of the RTK Query error ---
interface ApiError {
  status: number
  data: {
    message: string
    success?: boolean
    // Add other properties from your server's error response if any
  }
}

function isApiError(error: any): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data
  )
}

export function ContactView() {
  // --- State Management ---
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [message, setMessage] = useState("")

  // State for client-side validation errors
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    subject?: string
    message?: string
  }>({})

  // --- RTK Query Mutation Hook ---
  const [
    sendContactMessage,
    { isLoading, isSuccess, isError, error }, // 'error' is of type unknown
  ] = useSendContactMessageMutation()

  const confirmationRef = useRef<HTMLDivElement>(null)

  // --- Client-Side Validation ---
  const validate = () => {
    const newErrors: typeof errors = {}
    if (!name.trim()) newErrors.name = "Please enter your name"
    if (!email.trim()) newErrors.email = "Please enter your email"
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid"
    if (!subject.trim()) newErrors.subject = "Please enter a subject"
    if (!message.trim()) newErrors.message = "Please enter your message"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // --- Form Submission Handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    try {
      await sendContactMessage({
        name,
        email,
        subject,
        phoneNumber,
        message,
      }).unwrap()

      setName("")
      setEmail("")
      setSubject("")
      setPhoneNumber("")
      setMessage("")
      setErrors({})
    } catch (err) {
      console.error("Failed to send message:", err)
    }
  }

  // --- Accessibility: Focus on Confirmation Message ---
  useEffect(() => {
    if (isSuccess && confirmationRef.current) {
      confirmationRef.current.focus()
    }
  }, [isSuccess])

  // --- Render Logic ---
  return (
    <section className="mt-20 p-8 bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left: Form */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center md:text-left">
            Contact Us
          </h1>

          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              tabIndex={-1}
              ref={confirmationRef}
              aria-live="polite"
              className="p-8 bg-green-100 text-green-900 rounded-lg shadow-md text-center text-xl font-semibold"
            >
              Thanks for contacting us! We'll get back to you shortly.
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Form fields remain the same... */}
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block font-semibold text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-4 py-2 rounded-md border transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  aria-invalid={!!errors.name}
                  aria-describedby="name-error"
                  required
                />
                {errors.name && (
                  <p id="name-error" className="text-red-600 mt-1 text-sm">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block font-semibold text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2 rounded-md border transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  aria-invalid={!!errors.email}
                  aria-describedby="email-error"
                  required
                />
                {errors.email && (
                  <p id="email-error" className="text-red-600 mt-1 text-sm">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="block font-semibold text-gray-700 mb-1"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  placeholder="Message Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={`w-full px-4 py-2 rounded-md border transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.subject ? "border-red-500" : "border-gray-300"
                  }`}
                  aria-invalid={!!errors.subject}
                  aria-describedby="subject-error"
                  required
                />
                {errors.subject && (
                  <p id="subject-error" className="text-red-600 mt-1 text-sm">
                    {errors.subject}
                  </p>
                )}
              </div>

              {/* Phone Number (Optional) */}
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block font-semibold text-gray-700 mb-1"
                >
                  Phone Number{" "}
                  <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Your Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block font-semibold text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="Your Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className={`w-full px-4 py-2 rounded-md border resize-y transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.message ? "border-red-500" : "border-gray-300"
                  }`}
                  aria-invalid={!!errors.message}
                  aria-describedby="message-error"
                  required
                />
                {errors.message && (
                  <p id="message-error" className="text-red-600 mt-1 text-sm">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* API Error Message */}
              {isError && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md"
                  role="alert"
                >
                  <strong className="font-bold">Oops! </strong>
                  <span className="block sm:inline">
                    {/* --- FIX 3: Safely access the error message --- */}
                    {isApiError(error)
                      ? error.data.message
                      : "An unexpected error occurred. Please try again."}
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </motion.button>
            </form>
          )}
        </div>

        {/* Right: Image */}
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-100 rounded-lg p-4">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
            alt="A placeholder illustration for a contact page"
            className="rounded-xl shadow-lg object-cover w-full h-full"
          />
        </div>
      </div>
    </section>
  )
}
