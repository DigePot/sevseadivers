import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z as zod } from "zod"
import { useForgotPasswordMutation } from "../../../../store/auth/auth"
import { extractErrorMessage } from "../../../../utils/extract-error-message"

// Zod validation schema for forgot password
export const ForgotPasswordSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: "Email is required!" })
    .email({ message: "Email must be a valid email address!" }),
})

export type ForgotPasswordSchemaType = zod.infer<typeof ForgotPasswordSchema>

export function ForgotPasswordView() {
  const [globalError, setGlobalError] = useState<string>("")
  const [forgotPassword, { isLoading, isError, isSuccess }] =
    useForgotPasswordMutation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  })
  const navigate = useNavigate()

  const onSubmit = async (data: ForgotPasswordSchemaType) => {
    setGlobalError("")
    try {
      await forgotPassword({ email: data.email }).unwrap()
      navigate(`/reset-password?email=${data.email}`)
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
    <div className="flex justify-center items-center rounded-md h-screen bg-gradient-to-br from-sky-200 via-blue-100 to-white dark:from-slate-800 dark:to-slate-900 transition-all">
      <div className="max-w-md w-full bg-white p-6 rounded-md shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Forgot Password</h1>

        {/* Global Error */}
        {globalError && (
          <div
            role="alert"
            className="text-red-600 bg-red-100 p-3 rounded-md text-center font-semibold"
          >
            {globalError}
          </div>
        )}
        {isError && (
          <div
            role="alert"
            className="text-red-600 bg-red-100 p-3 rounded-md text-center font-semibold"
          >
            Failed to send reset link
          </div>
        )}
        {isSuccess && (
          <div
            role="alert"
            className="text-green-600 bg-green-100 p-3 rounded-md text-center font-semibold"
          >
            Password reset link sent to your email
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email input */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p id="email-error" className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  )
}
