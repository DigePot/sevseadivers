import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z as zod } from "zod"
import { useRouter } from "../../../routes/hooks"
import { paths } from "../../../routes/paths"
import { useUpdateStaffMutation } from "../../../store/admin"
import type { Staff } from "../../../types/staff"
import { extractErrorMessage } from "../../../utils/extract-error-message"

// ----------------------------------------------------------------------

export const StaffSchema = zod.object({
  username: zod
    .string()
    .min(3, { message: "Username must be at least 3 characters!" }),
  email: zod.string().email({ message: "Invalid email address!" }),
  fullName: zod.string().min(1, { message: "Full name is required!" }),
  phoneNumber: zod
    .string()
    .min(6, { message: "Phone number must be at least 6 digits!" }),
  address: zod.string().optional(),
  dateOfBirth: zod.string().optional(),
})

export type StaffSchemaType = zod.infer<typeof StaffSchema>

// ----------------------------------------------------------------------

type Props = {
  currentStaff?: Staff | null
}

export function StaffEditForm({ currentStaff }: Props) {
  const router = useRouter()
  const [updateStaff] = useUpdateStaffMutation()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form with current staff values
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setError,
    setValue,
  } = useForm<StaffSchemaType>({
    resolver: zodResolver(StaffSchema),
    defaultValues: {
      username: currentStaff?.username || "",
      email: currentStaff?.email || "",
      fullName: currentStaff?.fullName || "",
      phoneNumber: currentStaff?.phoneNumber || "",
      address: currentStaff?.address || "",
      dateOfBirth: currentStaff?.dateOfBirth?.split("T")[0] || "",
    },
  })

  // Reset form when currentStaff changes
  useEffect(() => {
    if (currentStaff) {
      reset({
        username: currentStaff.username,
        email: currentStaff.email,
        fullName: currentStaff.fullName,
        phoneNumber: currentStaff.phoneNumber,
        address: currentStaff.address || "",
        dateOfBirth: currentStaff.dateOfBirth?.split("T")[0] || "",
      })
    }
  }, [currentStaff, reset])

  const onSubmit = handleSubmit(async (data) => {
    if (!currentStaff?.id) return

    try {
      setIsSubmitting(true)

      // Prepare the update data
      const updateData = {
        ...data,
        // Only include changed fields
        ...(data.address === currentStaff.address
          ? {}
          : { address: data.address }),
        ...(data.dateOfBirth === currentStaff.dateOfBirth?.split("T")[0]
          ? {}
          : { dateOfBirth: data.dateOfBirth }),
      }

      // Send update request
      await updateStaff({
        id: currentStaff.id,
        body: updateData,
      }).unwrap()

      // Redirect to staff list after successful update
      router.push(paths.dashboard.staff.list)
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error.data)
      setError("root", {
        message: errorMessage || "Failed to update staff member",
      })
    } finally {
      setIsSubmitting(false)
    }
  })

  if (!currentStaff) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading staff data...</p>
      </div>
    )
  }

  return (
    <div className="">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Edit Staff Member: {currentStaff.fullName}
      </h1>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name *
            </label>
            <input
              id="fullName"
              type="text"
              {...register("fullName")}
              className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                errors.fullName
                  ? "border-red-300 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
              placeholder="Staff member's full name"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName.message}</p>
            )}
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username *
            </label>
            <input
              id="username"
              type="text"
              {...register("username")}
              className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                errors.username
                  ? "border-red-300 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
              placeholder="Enter username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email *
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                errors.email
                  ? "border-red-300 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
              placeholder="staff@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number *
            </label>
            <input
              id="phoneNumber"
              type="tel"
              {...register("phoneNumber")}
              className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                errors.phoneNumber
                  ? "border-red-300 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
              placeholder="e.g., 617909090"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium text-gray-700"
            >
              Date of Birth
            </label>
            <input
              id="dateOfBirth"
              type="date"
              {...register("dateOfBirth")}
              className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                errors.dateOfBirth
                  ? "border-red-300 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-sm">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <input
              id="address"
              {...register("address")}
              className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                errors.address
                  ? "border-red-300 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
              placeholder="Enter full address"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className={`px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-sm transition-colors ${
              isSubmitting || !isDirty
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            <div className="flex items-center justify-center">
              {isSubmitting && (
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
              )}
              {isSubmitting ? "Updating..." : "Update Staff"}
            </div>
          </button>

          <button
            type="button"
            onClick={() => router.push(paths.dashboard.staff.list)}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg shadow-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>

      {errors.root && (
        <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg">
          {errors.root.message}
        </div>
      )}
    </div>
  )
}
