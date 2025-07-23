import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"

export function ContactView() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    message?: string
  }>({})
  const [submitted, setSubmitted] = useState(false)
  const confirmationRef = useRef<HTMLDivElement>(null)

  const validate = () => {
    const newErrors: typeof errors = {}
    if (!name.trim()) newErrors.name = "Please enter your name"
    if (!email.trim()) newErrors.email = "Please enter your email"
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid"
    if (!message.trim()) newErrors.message = "Please enter your message"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitted(true)
    // Optionally clear form
    setName("")
    setEmail("")
    setMessage("")
  }

  useEffect(() => {
    if (submitted && confirmationRef.current) {
      confirmationRef.current.focus()
    }
  }, [submitted])

  return (
    <section className=" mt-20 p-8 bg-white rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left: Form */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-8 text-blue-900 text-center md:text-left">
            Contact Us
          </h1>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              tabIndex={-1}
              ref={confirmationRef}
              aria-live="polite"
              className="p-8 bg-green-100 text-green-900 rounded-lg shadow-lg text-center text-xl font-semibold"
            >
              Thanks for contacting us! We'll get back to you shortly.
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Name */}
              <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
                <label
                  htmlFor="name"
                  className="md:w-32 font-semibold text-blue-800 py-1"
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
                  className={`flex-grow px-4 py-2 rounded-md border transition duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  aria-invalid={!!errors.name}
                  aria-describedby="name-error"
                  required
                />
              </div>
              <motion.p
                id="name-error"
                className="text-red-600 mt-1 text-sm ml-32 md:ml-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: errors.name ? 1 : 0 }}
                role="alert"
              >
                {errors.name}
              </motion.p>

              {/* Email */}
              <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
                <label
                  htmlFor="email"
                  className="md:w-32 font-semibold text-blue-800 py-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`flex-grow px-4 py-2 rounded-md border transition duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  aria-invalid={!!errors.email}
                  aria-describedby="email-error"
                  required
                />
              </div>
              <motion.p
                id="email-error"
                className="text-red-600 mt-1 text-sm ml-32 md:ml-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: errors.email ? 1 : 0 }}
                role="alert"
              >
                {errors.email}
              </motion.p>

              {/* Message */}
              <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                <label
                  htmlFor="message"
                  className="md:w-32 font-semibold text-blue-800 pt-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="Your Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className={`flex-grow px-4 py-2 rounded-md border resize-y transition duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    errors.message ? "border-red-500" : "border-gray-300"
                  }`}
                  aria-invalid={!!errors.message}
                  aria-describedby="message-error"
                  required
                />
              </div>
              <motion.p
                id="message-error"
                className="text-red-600 mt-1 text-sm ml-32 md:ml-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: errors.message ? 1 : 0 }}
                role="alert"
              >
                {errors.message}
              </motion.p>

              {/* Submit */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-blue-700 text-white py-3 rounded-md font-semibold hover:bg-blue-800 transition"
              >
                Send Message
              </motion.button>
            </form>
          )}
        </div>

        {/* Right: Image or Info block */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
            alt="Contact illustration"
            className="rounded-xl shadow-lg object-cover w-full h-full max-h-[400px]"
          />
        </div>
      </div>
    </section>
  )
}
