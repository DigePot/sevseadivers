import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { z as zod } from "zod"
import { useRouter, useSearchParams } from "../../../routes/hooks"
import { API } from "../../../store/api"
import { setCredentials } from "../../../store/auth/auth-slice"
import { extractErrorMessage } from "../../../utils/extract-error-message"

// Define Zod schema for validation
export const SignUpSchema = zod.object({
  fullName: zod.string().min(1, { message: "Full Name is required!" }),
  username: zod.string().min(1, { message: "User Name is required!" }),
  email: zod
    .string()
    .min(1, { message: "Email is required!" })
    .email({ message: "Email must be a valid email address!" }),
  phoneNumber: zod.string().min(1, { message: "Phone Number is required!" }),
  password: zod
    .string()
    .min(1, { message: "Password is required!" })
    .min(6, { message: "Password must be at least 6 characters!" }),
  confirmPassword: zod
    .string()
    .min(1, { message: "Confirm Password is required!" })
    .min(6, { message: "Password must be at least 6 characters!" }),
})

export type SignUpSchemaType = zod.infer<typeof SignUpSchema>

export const SignUpForm: React.FC = () => {
  const [globalError, setGlobalError] = useState<string>("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get("returnTo")
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    watch,
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  })

  const password = watch("password")
  const confirmPassword = watch("confirmPassword")

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
    try {
      const res = await axios.post(`${API}/users/register`, {
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: "staff",
      })
      console.log(res.data)

      const { token } = res.data
      const { role, email, id } = res.data.user
      dispatch(setCredentials({ token, role, email, id }))

      // Redirect based on user role after successful signup
      router.push(handleRoleBasedRedirect(role))
    } catch (error: any) {
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
      <h2 className="text-xl font-semibold text-center">Sign Up</h2>

      {/* Full Name Field */}
      <div>
        <input
          type="text"
          placeholder="Full Name"
          {...register("fullName")}
          className="mt-1 p-3 w-full bg-gray-100 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#1AB2E5] focus:outline-none"
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm">{errors.fullName.message}</p>
        )}
      </div>

      {/* User Name Field */}
      <div>
        <input
          type="text"
          placeholder="Username"
          {...register("username")}
          className="mt-1 p-3 w-full bg-gray-100 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#1AB2E5] focus:outline-none"
        />
        {errors.username && (
          <p className="text-red-500 text-sm">{errors.username.message}</p>
        )}
      </div>

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

      {/* Phone Number Field */}
      <div>
        <input
          type="tel"
          placeholder="Phone Number"
          {...register("phoneNumber")}
          className="mt-1 p-3 w-full bg-gray-100 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#1AB2E5] focus:outline-none"
        />
        {errors.phoneNumber && (
          <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
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

      {/* Confirm Password Field */}
      <div>
        <input
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword")}
          className="mt-1 p-3 w-full bg-gray-100 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#1AB2E5] focus:outline-none"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
        {password !== confirmPassword && confirmPassword && (
          <p className="text-red-500 text-sm">Passwords do not match</p>
        )}
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="w-full py-3 bg-[#1AB2E5] text-white cursor-pointer font-bold rounded-md hover:bg-[#1AB2E5]/80 focus:outline-none"
        >
          {isSubmitting ? "..." : "Sign Up"}
        </button>
      </div>
    </form>
  )
}
