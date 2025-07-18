import React, { useEffect, useState } from "react"
import { useUpdateMyProfileMutation } from "../../../../store/auth/auth"
import { useUser } from "../../../auth/hooks"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z as zod } from "zod"
import { motion } from "framer-motion"
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import type { SerializedError } from "@reduxjs/toolkit"
import { extractErrorMessage } from "../../../../utils/extract-error-message"

const profileSchema = zod.object({
  fullName: zod.string().min(2, { message: "Name too short" }),
  email: zod.string().email({ message: "Invalid email" }),
  phoneNumber: zod.string().min(7).optional().or(zod.literal("")),
  address: zod.string().optional().or(zod.literal("")),
  dateOfBirth: zod.string().optional().or(zod.literal("")),
})

export type ProfileFormType = zod.infer<typeof profileSchema>

export const ProfileView = () => {
  const id = localStorage.getItem("id") ?? ""
  const { user } = useUser(id)
  const [updateMyProfile, { isLoading, error, isSuccess }] = useUpdateMyProfileMutation()
  const [originalProfile, setOriginalProfile] = useState<ProfileFormType | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormType>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    if (user) {
      const { fullName, email, phoneNumber, address, dateOfBirth } = user
      const formattedDOB = dateOfBirth ? new Date(dateOfBirth).toISOString().split("T")[0] : ""
      const data: ProfileFormType = {
        fullName: fullName || "",
        email: email || "",
        phoneNumber: phoneNumber || "",
        address: address || "",
        dateOfBirth: formattedDOB,
      }
      reset(data)
      setOriginalProfile(data)
    }
  }, [user, reset])

  const onSubmit = async (data: ProfileFormType) => {
    if (user?.id) {
      try {
        await updateMyProfile({ id: parseInt(user.id), body: data }).unwrap()
        const formattedDOB = data.dateOfBirth
          ? new Date(data.dateOfBirth).toISOString().split("T")[0]
          : ""
        setOriginalProfile({ ...data, dateOfBirth: formattedDOB })
      } catch (err) {
        console.error(err)
      }
    }
  }

  const renderError = (error: FetchBaseQueryError | SerializedError | undefined) => {
    if (!error) return null
    if ("data" in error) {
      const errorData = error.data as { error?: string }
      return errorData.error || "Unknown error"
    }
    return "An unexpected error occurred."
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-blue-100 to-white dark:from-slate-800 dark:to-slate-900 transition-all">
      {/* Wave Header */}
      <div className="relative h-48 bg-cyan-600 dark:bg-cyan-800 rounded-b-[60px] shadow-lg overflow-hidden">
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,192L60,186.7C120,181,240,171,360,154.7C480,139,600,117,720,117.3C840,117,960,139,1080,144C1200,149,1320,139,1380,133.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          ></path>
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="-mt-32 mx-auto max-w-4xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-10 shadow-xl border border-white/30 dark:border-slate-700"
      >
        <h2 className="text-3xl font-extrabold text-center text-slate-800 dark:text-white mb-10">
          Update Your Profile
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            ["Full Name", "fullName"],
            ["Email", "email"],
            ["Phone", "phoneNumber"],
            ["Address", "address"],
            ["Date of Birth", "dateOfBirth"],
          ].map(([label, name]) => (
            <div key={name}>
              <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">
                {label}
              </label>
              <input
                type={name === "dateOfBirth" ? "date" : "text"}
                {...register(name as keyof ProfileFormType)}
                className="w-full mt-2 px-4 py-2 rounded-xl bg-white/70 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 shadow-inner focus:ring-2 focus:ring-cyan-500 text-slate-800 dark:text-white"
              />
              {errors[name as keyof typeof errors] && (
                <p className="text-xs text-red-500 mt-1">
                  {errors[name as keyof typeof errors]?.message}
                </p>
              )}
            </div>
          ))}
        </form>

        <div className="mt-10 flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            onClick={handleSubmit(onSubmit)}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition duration-300 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {isSuccess && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-600 text-center mt-6"
          >
            ✅ Profile updated successfully!
          </motion.p>
        )}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-center mt-6"
          >
            {renderError(error)}
          </motion.p>
        )}
      </motion.div>
    </div>
  )
}
