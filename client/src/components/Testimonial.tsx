"use client"

import type React from "react"
import Profile from "../assets/profile.png"
import BoyProfile from "../assets/boy-profile.png"

import { useState, useRef } from "react"
import { Plus, Quote } from "lucide-react"
import { useTranslation } from "react-i18next"

interface Testimonial {
  id: number
  name: string
  role?: string
  testimonial: string
  avatar?: string // This will now store a Data URL or a static path
}

const Testimonial = () => {
  const { t } = useTranslation()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Product Manager at TechCorp",
      testimonial:
        "John delivered an exceptional website that exceeded our expectations. His attention to detail and creative problem-solving made the entire process smooth and enjoyable.",
      avatar: Profile,
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Startup Founder",
      testimonial:
        "Working with John was a game-changer for our startup. He transformed our vision into a beautiful, functional platform that our users love. Highly recommended!",
      avatar: BoyProfile,
    },
    {
      id: 3,
      name: "David Rodriguez",
      role: "Creative Director",
      testimonial:
        "John's combination of technical expertise and design sensibility is rare. He created exactly what we needed and more. A true professional.",
      avatar: BoyProfile,
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    testimonial: "",
    avatarPreview: "" as string | ArrayBuffer | null, // To store the Data URL for preview
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{
    text: string
    type: "success" | "error"
  } | null>(null) // For custom toast
  const fileInputRef = useRef<HTMLInputElement>(null) // Ref for file input

  // Custom "toast" function
  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type })
    setTimeout(() => {
      setMessage(null)
    }, 3000) // Message disappears after 3 seconds
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        showMessage(
          "Please upload an image file (e.g., JPG, PNG, GIF).",
          "error"
        )
        setFormData((prev) => ({ ...prev, avatarPreview: null }))
        if (fileInputRef.current) {
          fileInputRef.current.value = "" // Clear the file input
        }
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          avatarPreview: reader.result, // Store Data URL
        }))
      }
      reader.readAsDataURL(file)
    } else {
      setFormData((prev) => ({ ...prev, avatarPreview: null }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Basic validation
    if (!formData.name.trim() || !formData.testimonial.trim()) {
      showMessage("Please fill in all required fields.", "error")
      setIsSubmitting(false)
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newTestimonial: Testimonial = {
      id:
        testimonials.length > 0
          ? Math.max(...testimonials.map((t) => t.id)) + 1
          : 1, // Ensure unique ID
      name: formData.name.trim(),
      role: formData.role.trim() || undefined,
      testimonial: formData.testimonial.trim(),
      avatar: formData.avatarPreview
        ? String(formData.avatarPreview)
        : undefined, // Use Data URL
    }

    setTestimonials((prev) => [...prev, newTestimonial])
    setFormData({ name: "", role: "", testimonial: "", avatarPreview: null }) // Reset avatar field
    setIsModalOpen(false)
    setIsSubmitting(false)

    // Clear the file input using the ref
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    showMessage("Your testimonial has been added successfully.", "success")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Tailwind classes for common UI elements - Adjusted for white theme
  const buttonOutlineClasses =
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 hover:text-gray-900"
  const inputClasses =
    "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-800 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  const textareaClasses =
    "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-800 ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  const labelClasses =
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-800" // Label text color

  return (
    <section id="testimonials" className="py-20 px-4">
      {/* Embedded CSS styles */}
      <style>{`
        @keyframes fade-in-slide-up {
          from {
            opacity: 0;
            transform: translateY(30px); /* Starts 30px below its final position */
          }
          to {
            opacity: 1;
            transform: translateY(0); /* Ends at its final position */
          }
        }

        .testimonial-card-animation {
          animation: fade-in-slide-up 0.7s ease-out forwards; /* 0.7s duration, ease-out timing, stays at end state */
          opacity: 0; /* Start hidden before animation */
        }

        /* Custom Modal Styles - Adjusted for white theme */
        .custom-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50; /* Tailwind's z-50 */
        }

        .custom-modal-content {
          background-color: #ffffff; /* White background for modal */
          border-radius: 0.75rem; /* rounded-xl */
          padding: 1.5rem; /* p-6 */
          width: 100%;
          max-width: 28rem; /* sm:max-w-md */
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-md */
          position: relative;
        }

        .custom-modal-close-button {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.5rem;
          border-radius: 0.375rem; /* rounded-md */
          background-color: transparent;
          border: none;
          cursor: pointer;
          color: #6b7280; /* gray-500 */
          transition: color 0.2s ease-in-out;
        }
        .custom-modal-close-button:hover {
          color: #1f2937; /* gray-800 */
        }
      `}</style>
      <div className="max-w-6xl mx-auto">
        <div className="section-fade-in">
          <h2 className="text-4xl font-bold text-center text-cyan-600 mb-12 tracking-tight">
            {t("review.title")}
          </h2>
          <p className="text-lg text-gray-300 text-center mb-16 max-w-2xl mx-auto">
            {t("review.text")}
          </p>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="bg-white p-8 rounded-xl shadow-md border border-gray-200 card-hover testimonial-card-animation" // Card background white, border light gray
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <Quote className="w-8 h-8 text-blue-500 flex-shrink-0 mt-1" />{" "}
                  {/* Accent color for quote icon */}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.testimonial}"
                </p>{" "}
                {/* Testimonial text dark gray */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {" "}
                    {/* Initials background light gray */}
                    {testimonial.avatar ? (
                      <img
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-gray-700">
                        {" "}
                        {/* Initials text dark gray */}
                        {getInitials(testimonial.name)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {testimonial.name}
                    </h4>{" "}
                    {/* Name text dark gray */}
                    {testimonial.role && (
                      <p className="text-sm text-gray-600">
                        {testimonial.role}
                      </p>
                    )}{" "}
                    {/* Role text medium gray */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Testimonial Button */}
          {/* <div className="text-center">
            <button
              className={
                "t-60 inline-flex items-center bg-cyan-500 hover:bg-cyan-600 focus:ring-4 focus:ring-cyan-300 font-semibold px-8 py-2 rounded-full text-sm shadow-sm transition-all transform hover:scale-80 active:scale-65 text-white"
              } // Added text-white for button text
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-200" />
              Add Testimonial
            </button>
          </div> */}

          {/* Custom Modal */}
          {isModalOpen && (
            <div className="custom-modal-overlay">
              <div className="custom-modal-content">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-center text-cyan-600 tracking-tight">
                    Share Your Experience
                  </h3>{" "}
                  {/* Modal title dark gray */}
                  <button
                    className="custom-modal-close-button"
                    onClick={() => setIsModalOpen(false)}
                  >
                    &times; {/* HTML entity for 'x' */}
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                  <div className="space-y-2">
                    <label htmlFor="modal-name" className={labelClasses}>
                      Name *
                    </label>
                    <input
                      id="modal-name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      required
                      className={`${inputClasses} transition-all duration-200 focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="modal-role" className={labelClasses}>
                      Role or Title
                    </label>
                    <input
                      id="modal-role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      placeholder="e.g., CEO at Company (optional)"
                      className={`${inputClasses} transition-all duration-200 focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="modal-avatar" className={labelClasses}>
                      Upload Avatar (Optional)
                    </label>
                    <input
                      id="modal-avatar"
                      name="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      ref={fileInputRef}
                      className={`${inputClasses} transition-all duration-200 focus:ring-2 focus:ring-blue-500`}
                    />
                    {formData.avatarPreview && (
                      <div className="mt-2">
                        <img
                          src={
                            String(formData.avatarPreview) || "/placeholder.svg"
                          }
                          alt="Avatar Preview"
                          className="w-20 h-20 rounded-full object-cover border border-gray-300"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="modal-testimonial" className={labelClasses}>
                      Testimonial *
                    </label>
                    <textarea
                      id="modal-testimonial"
                      name="testimonial"
                      value={formData.testimonial}
                      onChange={handleInputChange}
                      placeholder="Share your experience working with John..."
                      rows={4}
                      required
                      className={`${textareaClasses} transition-all duration-200 focus:ring-2 focus:ring-blue-500 resize-none`}
                    />
                  </div>

                  {message && (
                    <div
                      className={`p-3 rounded-md text-sm ${
                        message.type === "success"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                      role="alert"
                    >
                      {message.text}
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      className={`${buttonOutlineClasses} flex-1`}
                      onClick={() => setIsModalOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 text-white bg-cyan-500 hover:bg-cyan-600" // Primary button dark blue with white text
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Adding..." : "Add Testimonial"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Testimonial
