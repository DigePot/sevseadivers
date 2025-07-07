import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { z as zod } from "zod"
import { useRouter, useSearchParams } from "../../../routes/hooks"
import type { AppDispatch } from "../../../store"
import { API } from "../../../store/api"
import { setCredentials } from "../../../store/auth/auth-slice"
import { extractErrorMessage } from "../../../utils/extract-error-message"

// Define Zod schema for validation
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

  // Handling form submission
  const onSubmit = async (data: SignInSchemaType) => {
    try {
      const res = await axios.post(`${API}/users/login`, {
        email: data.email,
        password: data.password,
      })
      console.log(res.data)

      const { token } = res.data
      const { role, email, id } = res.data.user
      dispatch(setCredentials({ token: token, role, email, id }))

      // Redirect user based on their role
      router.push(handleRoleBasedRedirect(role))
      router.refresh()
    } catch (error: any) {
      // const e = getErrorMessage(error)
      // setGlobalError(`Login failed: Try again please`) // Set global error message

      console.log("error", error.response)
      if (error.response) {
        const errorMessage = extractErrorMessage(error.response.data) // Extract the message from HTML
        setGlobalError(errorMessage) // Set global error message
      } else {
        setGlobalError("An unknown error occurred")
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)} // Using handleSubmit to handle validation and submission
      className="space-y-4 max-w-lg w-full bg-white p-6 rounded-xl shadow-lg"
    >
      {/* Global Error Message */}
      {globalError && (
        <div className="text-red-500 text-center mb-4">
          <p>{globalError}</p>
        </div>
      )}

      {/* Form Header */}
      <h2 className="text-xl font-semibold text-center">Sign In</h2>

      {/* Email Field */}
      <div>
        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="mt-1 p-3 w-full bg-gray-100 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#1AB2E5] focus:outline-none"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          className="mt-1 p-3 w-full bg-gray-100 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#1AB2E5] focus:outline-none"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="w-full py-3 bg-[#1AB2E5] text-white cursor-pointer font-bold rounded-md hover:bg-[#1AB2E5]/80 focus:outline-none"
        >
          {isSubmitting ? "..." : "Sign In"}
        </button>
      </div>

      {/* Forgot Password Link */}
      <div className="text-center">
        <Link
          to="/forgot-password"
          className="text-sm text-[#1AB2E5] hover:text-[#121717] font-semibold"
        >
          Forgot Password?
        </Link>
      </div>
    </form>
  )
}
