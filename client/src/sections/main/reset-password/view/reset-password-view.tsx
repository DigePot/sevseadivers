import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useLocation } from "react-router"
import { z as zod } from "zod"
import { useResetPasswordMutation } from "../../../../store/auth/auth"
import { extractErrorMessage } from "../../../../utils/extract-error-message"
import { useRouter } from "../../../../routes/hooks"
import { paths } from "../../../../routes/paths"

// Zod validation schema for reset password
export const ResetPasswordSchema = zod.object({
  otp: zod.string().min(1, { message: "OTP is required!" }),
  password: zod
    .string()
    .min(6, { message: "Password must be at least 6 characters!" }),
})

export type ResetPasswordSchemaType = zod.infer<typeof ResetPasswordSchema>

export function ResetPasswordView() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const email = searchParams.get("email") || ""
  const router = useRouter()

  const [globalError, setGlobalError] = useState<string>("")
  const [resetPassword, { isLoading, isError, isSuccess }] =
    useResetPasswordMutation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { otp: "", password: "" },
  })

  const onSubmit = async (data: ResetPasswordSchemaType) => {
    setGlobalError("")
    try {
      await resetPassword({
        email,
        otp: data.otp,
        password: data.password,
      }).unwrap()
      // Redirect after successful reset
      router.push(paths.auth.jwt.signIn)
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
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-sky-200 via-blue-100 to-white dark:from-slate-800 dark:to-slate-900 transition-all">
      <div className="max-w-md w-full bg-white p-6 rounded-md shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>

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
            Failed to reset password
          </div>
        )}
        {isSuccess && (
          <div
            role="alert"
            className="text-green-600 bg-green-100 p-3 rounded-md text-center font-semibold"
          >
            Password reset successfully
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* OTP input */}
          <div className="mb-4">
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
              OTP
            </label>
            <input
              id="otp"
              type="text"
              placeholder="Enter OTP"
              {...register("otp")}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                errors.otp ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.otp && (
              <p id="otp-error" className="text-red-500 text-sm mt-1">
                {errors.otp.message}
              </p>
            )}
          </div>

          {/* Password input */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your new password"
              {...register("password")}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p id="password-error" className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  )
}
