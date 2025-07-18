import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import axios from "axios"
import { z as zod } from "zod"
import {
  FaUserCircle,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaCheckCircle,
} from "react-icons/fa"
import { useRouter, useSearchParams } from "../../../routes/hooks"
import type { AppDispatch } from "../../../store"
import { useDispatch } from "react-redux"
import { setCredentials } from "../../../store/auth/auth-slice"
import { API } from "../../../store/api"
import { extractErrorMessage } from "../../../utils/extract-error-message"

export const SignUpSchema = zod
  .object({
    fullName: zod.string().min(1, "Full Name is required!"),
    username: zod.string().min(1, "User Name is required!"),
    email: zod
      .string()
      .min(1, "Email is required!")
      .email("Invalid email address!"),
    phoneNumber: zod.string().min(1, "Phone Number is required!"),
    role: zod.string().min(1, "Role Name is required!"),
    password: zod.string().min(6, "Password must be at least 6 characters!"),
    confirmPassword: zod.string().min(6, "Confirm Password is required!"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

export type SignUpSchemaType = zod.infer<typeof SignUpSchema>

const iconMap: Record<string, React.ReactNode> = {
  fullName: <FaUserCircle className="text-cyan-500" />,
  username: <FaUser className="text-cyan-500" />,
  email: <FaEnvelope className="text-cyan-500" />,
  phoneNumber: <FaPhone className="text-cyan-500" />,
  password: <FaLock className="text-cyan-500" />,
  confirmPassword: <FaCheckCircle className="text-cyan-500" />,
}

export const SignUpForm: React.FC = () => {
  const [globalError, setGlobalError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get("returnTo")
  const dispatch: AppDispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      role: "client",
    },
  })

  // Redirect user based on role or returnTo param
  const handleRoleBasedRedirect = (role: string) => {
    if (returnTo) return returnTo
    switch (role.toLocaleLowerCase()) {
      case "admin":
        return "/dashboard"
      case "staff":
        return "/staff-dashboard"
      default:
        return "/"
    }
  }

  const onSubmit = async (data: SignUpSchemaType) => {
    setGlobalError("")
    setIsSubmitting(true)
    try {
      const res = await axios.post(`${API}/users/register`, data)

      const { token } = res.data
      const { role, email, id } = res.data.user
      dispatch(setCredentials({ token, role, email, id }))

      router.push(handleRoleBasedRedirect(role))
      router.refresh()
    } catch (error: any) {
      if (error.response) {
        const errorMessage = extractErrorMessage(error.response.data)
        setGlobalError(errorMessage)
      } else {
        setGlobalError("An unknown error occurred")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const fields: (keyof SignUpSchemaType)[] = [
    "fullName",
    "username",
    "email",
    "phoneNumber",
    "password",
    "confirmPassword",
  ]

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)} // Ensure handleSubmit is wrapping onSubmit
      className="max-w-lg mx-auto bg-gradient-to-br from-cyan-100 to-blue-200 p-10 rounded-xl shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      noValidate
      aria-live="assertive"
    >
      <h2 className="text-4xl font-extrabold text-center text-cyan-700 mb-10 tracking-wide">
        Create Your Account
      </h2>

      <AnimatePresence>
        {globalError && (
          <motion.div
            className="bg-red-200 text-red-800 px-5 py-3 mb-6 rounded-lg text-center font-semibold"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            role="alert"
          >
            {globalError}
          </motion.div>
        )}
      </AnimatePresence>

      {fields.map((name) => {
        const label = name
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())

        const type = name.toLowerCase().includes("password")
          ? "password"
          : name.toLowerCase() === "email"
          ? "email"
          : "text"

        const autoComplete =
          name === "email"
            ? "email"
            : name === "password" || name === "confirmPassword"
            ? "new-password"
            : "off"

        const hasError = Boolean(errors[name])

        return (
          <motion.div
            key={name}
            className="mb-6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <label
              htmlFor={name}
              className="block mb-2 font-semibold text-gray-700"
            >
              {label}
            </label>
            <div
              className={`relative flex items-center rounded-lg border ${
                hasError ? "border-red-500" : "border-gray-300"
              } bg-white focus-within:ring-2 focus-within:ring-cyan-400 transition-shadow`}
            >
              <span className="absolute left-3 text-cyan-500 pointer-events-none">
                {iconMap[name]}
              </span>
              <input
                id={name}
                type={type}
                autoComplete={autoComplete}
                aria-invalid={hasError ? "true" : "false"}
                {...register(name)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg bg-transparent focus:outline-none transition ${
                  hasError ? "placeholder-red-400" : "placeholder-gray-400"
                }`}
                placeholder={label}
              />
            </div>
            {hasError && (
              <motion.p
                className="mt-1 text-red-600 text-sm font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {errors[name]?.message as string}
              </motion.p>
            )}
          </motion.div>
        )
      })}

      <button
        type="submit" // Make sure this button is type="submit"
        disabled={isSubmitting}
        className="w-full mt-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-opacity-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Signing up..." : "Sign Up"}
      </button>

      <p className="mt-6 text-center text-gray-600">
        Already have an account?{" "}
        <Link
          to="/auth/sign-in"
          className="text-cyan-700 hover:underline font-semibold"
        >
          Sign In
        </Link>
      </p>
    </motion.form>
  )
}
