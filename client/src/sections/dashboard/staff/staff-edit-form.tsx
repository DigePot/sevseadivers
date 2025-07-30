import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState, useRef } from "react"
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
  bio: zod.string().optional(),
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
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      bio: currentStaff?.bio || "",
    },
  })

  // Reset form when currentStaff changes
  useEffect(() => {
    if (currentStaff) {
      reset({
        username: currentStaff.username || "",
        email: currentStaff.email || "",
        fullName: currentStaff.fullName || "",
        phoneNumber: currentStaff.phoneNumber || "",
        address: currentStaff.address || "",
        dateOfBirth: currentStaff.dateOfBirth?.split("T")[0] || "",
        bio: currentStaff.bio || "",
      })
    }
  }, [currentStaff, reset])

  const onSubmit = handleSubmit(async (data) => {
    if (!currentStaff?.id) return
    try {
      setIsSubmitting(true)
      const formData = new FormData()
      formData.append("username", data.username)
      formData.append("email", data.email)
      formData.append("fullName", data.fullName)
      formData.append("phoneNumber", data.phoneNumber)
      if (data.address) formData.append("address", data.address)
      if (data.dateOfBirth) formData.append("dateOfBirth", data.dateOfBirth)
      if (data.bio) formData.append("bio", data.bio)
      if (fileInputRef.current?.files?.[0]) {
        formData.append("profilePicture", fileInputRef.current.files[0])
      }
      // Use 'body' instead of 'data' if your updateStaff expects it
      await updateStaff({ id: currentStaff.id, body: formData }).unwrap()
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

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

      <form
        onSubmit={onSubmit}
        className="space-y-6"
        encType="multipart/form-data"
      >
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

          {/* Job Title */}
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Job Title *
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
              placeholder="Enter job title"
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

          {/* Bio */}
          <div className="space-y-2">
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700"
            >
              Bio
            </label>
            <textarea
              id="bio"
              {...register("bio")}
              className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                errors.bio
                  ? "border-red-300 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
              placeholder="Short bio about the staff member"
              rows={3}
            />
            {errors.bio && (
              <p className="text-red-500 text-sm">{errors.bio.message}</p>
            )}
          </div>

          {/* Profile Picture */}
          <div className="space-y-2">
            <label
              htmlFor="profilePicture"
              className="block text-sm font-medium text-gray-700"
            >
              Profile Picture{" "}
              <span className="text-xs text-gray-400">(JPG, PNG, max 2MB)</span>
            </label>
            {/* Show preview if new image selected, else show current */}
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-full border mb-2"
              />
            ) : currentStaff?.profilePicture ? (
              <img
                src={`http://api.sevseadivers.com${currentStaff.profilePicture}`}
                alt="Current profile"
                className="w-24 h-24 object-cover rounded-full border mb-2"
              />
            ) : null}
            <input
              id="profilePicture"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <span className="text-xs text-gray-400">
              Recommended: Square image, max 2MB.
            </span>
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
        </div>
      </form>
    </div>
  )
}
