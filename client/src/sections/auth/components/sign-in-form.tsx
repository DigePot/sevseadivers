import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { Link } from "react-router"
import { z as zod } from "zod"
import { useRouter, useSearchParams } from "../../../routes/hooks"
import type { AppDispatch } from "../../../store"
import { API } from "../../../store/api"
import { setCredentials } from "../../../store/auth/auth-slice"
import { extractErrorMessage } from "../../../utils/extract-error-message"

// Zod validation schema
export const SignInSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: "Email is required!" })
    .email({ message: "Email must be a valid email address!" }),
  password: zod
    .string()
    .min(1, { message: "Password is required!" })
    .min(6, { message: "Password must be at least 6 characters!" }),
})

export type SignInSchemaType = zod.infer<typeof SignInSchema>

export const SignInForm: React.FC = () => {
  const [globalError, setGlobalError] = useState<string>("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get("returnTo")
  const dispatch: AppDispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { email: "", password: "" },
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

  const onSubmit = async (data: SignInSchemaType) => {
    setGlobalError("")
    try {
      const res = await axios.post(`${API}/users/login`, {
        email: data.email,
        password: data.password,
      })

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
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg"
      noValidate
      aria-live="polite"
    >
      {/* Global Error */}
      {globalError && (
        <div
          role="alert"
          className="text-red-600 bg-red-100 p-3 rounded-md text-center font-semibold"
        >
          {globalError}
        </div>
      )}

      {/* Header */}
      <h2 className="text-2xl font-bold text-center text-gray-900">Sign In</h2>

      {/* Email input */}
      <div>
        <label
          htmlFor="email"
          className="block mb-1 font-semibold text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...register("email")}
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={`w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-cyan-500 transition ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-red-600 text-sm">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password input */}
      <div>
        <label
          htmlFor="password"
          className="block mb-1 font-semibold text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          {...register("password")}
          aria-invalid={errors.password ? "true" : "false"}
          aria-describedby={errors.password ? "password-error" : undefined}
          className={`w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-cyan-500 transition ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.password && (
          <p id="password-error" className="mt-1 text-red-600 text-sm">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-cyan-600 text-white font-bold rounded-md shadow hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>

      {/* Forgot Password */}
      <div className="text-center">
        <Link
          to="/forgot-password"
          className="text-cyan-600 hover:underline font-semibold text-sm"
        >
          Forgot Password?
        </Link>
      </div>

      {/* Sign Up link */}
      <p className="mt-4 text-center text-sm text-gray-700">
        Don’t have an account?{" "}
        <Link
          to="/auth/sign-up"
          className="text-cyan-600 hover:underline font-semibold"
        >
          Sign Up
        </Link>
      </p>
    </form>
  )
}
