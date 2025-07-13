import React, { useEffect, useState } from "react"
import { useUpdateMyProfileMutation } from "../../../../store/auth/auth"
import { useUser } from "../../../auth/hooks"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z as zod } from "zod"
import { extractErrorMessage } from "../../../../utils/extract-error-message"
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import type { SerializedError } from "@reduxjs/toolkit"

const profileSchema = zod.object({
  fullName: zod
    .string()
    .min(2, { message: "Full name must be at least 2 characters." }),
  email: zod.string().email({ message: "Invalid email address." }),
  phoneNumber: zod
    .string()
    .min(7, { message: "Phone number must be at least 7 characters." })
    .optional()
    .or(zod.literal("")), // Allow empty string
  address: zod.string().optional().or(zod.literal("")), // Allow empty string
  dateOfBirth: zod.string().optional().or(zod.literal("")), // Allow empty string
})

export type ProfileFormType = zod.infer<typeof profileSchema>

export const ProfileView: React.FC = () => {
  const id = localStorage.getItem("id") ?? ""
  const { user } = useUser(id)
  const [updateMyProfile, { isLoading, error, isSuccess }] =
    useUpdateMyProfileMutation()
  const [originalProfile, setOriginalProfile] =
    useState<ProfileFormType | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      address: "",
      dateOfBirth: "",
    },
  })

  useEffect(() => {
    if (user) {
      const { fullName, email, phoneNumber, address, dateOfBirth } = user

      // Format dateOfBirth to 'YYYY-MM-DD' for the input field
      const formattedDateOfBirth = dateOfBirth
        ? new Date(dateOfBirth).toISOString().split("T")[0]
        : ""

      const initialData: ProfileFormType = {
        fullName: fullName || "",
        email: email || "",
        phoneNumber: phoneNumber || "",
        address: address || "",
        dateOfBirth: formattedDateOfBirth, // Use the formatted date
      }
      reset(initialData)
      setOriginalProfile(initialData)
    }
  }, [user, reset])

  const onSubmit = async (data: ProfileFormType) => {
    if (user?.id) {
      try {
        console.log("Data being sent to backend:", data)
        await updateMyProfile({ id: parseInt(user.id), body: data }).unwrap()

        // On success, update the original profile state to match the new data
        const formattedDateOfBirth = data.dateOfBirth
          ? new Date(data.dateOfBirth).toISOString().split("T")[0]
          : ""
        const newProfileData = { ...data, dateOfBirth: formattedDateOfBirth }
        setOriginalProfile(newProfileData)
      } catch (err) {
        console.error("Error updating profile:", err)
      }
    }
  }

  const handleCancel = () => {
    if (originalProfile) {
      reset(originalProfile)
    }
  }

  // Helper function to render the error message safely
  const renderErrorMessage = (
    error: FetchBaseQueryError | SerializedError | undefined
  ) => {
    if (!error) return null

    // This is a type guard to check if the error is a FetchBaseQueryError
    if ("data" in error) {
      const errorData = error.data as { error?: string }
      console.log("eeeeeee", errorData)
      if (errorData.error) {
        return extractErrorMessage(errorData.error)
      }
    }

    // Fallback for SerializedError or other unexpected error shapes
    return "An unexpected error occurred."
  }

  return (
    <div className="">
      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name Input */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            {...register("fullName")}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.fullName ? "border-red-500" : ""
            }`}
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs italic">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email")}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs italic">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone Number Input */}
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            {...register("phoneNumber")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-xs italic">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        {/* Address Input */}
        <div>
          <label
            htmlFor="address"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            {...register("address")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.address && (
            <p className="text-red-500 text-xs italic">
              {errors.address.message}
            </p>
          )}
        </div>

        {/* Date of Birth Input */}
        <div>
          <label
            htmlFor="dateOfBirth"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            {...register("dateOfBirth")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.dateOfBirth && (
            <p className="text-red-500 text-xs italic">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>

        {/* Success and Error Messages */}
        {isSuccess && (
          <div className="mt-4 text-green-500">
            Profile updated successfully!
          </div>
        )}
        {error && (
          <div className="mt-4 text-red-500">{renderErrorMessage(error)}</div>
        )}
      </form>
    </div>
  )
}
