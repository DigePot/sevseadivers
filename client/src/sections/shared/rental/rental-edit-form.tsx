import { zodResolver } from "@hookform/resolvers/zod"
import { useRef, useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z as zod } from "zod"
import { useRouter } from "../../../routes/hooks"
import { paths } from "../../../routes/paths"
import { useUpdateRentalMutation } from "../../../store/rental"
import type { Rental } from "../../../types/rental"
import { FiAlertTriangle, FiCalendar } from "react-icons/fi"

// ----------------------------------------------------------------------

export const RentalSchema = zod.object({
  title: zod.string().min(1, { message: "Title is required!" }),
  location: zod.string().min(1, { message: "Location is required!" }),
  duration: zod.string().min(1, { message: "Duration is required!" }),
  description: zod.string().min(1, { message: "Description is required!" }),
  price: zod.number().min(1, { message: "Price must be at least $1" }),
  status: zod.string().min(1, { message: "Status is required!" }),
})

export type RentalSchemaType = zod.infer<typeof RentalSchema>

// ----------------------------------------------------------------------

type Props = {
  currentRental?: Rental | null
}

export function RentalEditForm({ currentRental }: Props) {
  const router = useRouter()
  const [updateRental] = useUpdateRentalMutation()

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize form with empty values first
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<RentalSchemaType>({
    resolver: zodResolver(RentalSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      price: 0,
      duration: "",
      status: "available",
    },
  })

  // Reset form when currentRental changes
  useEffect(() => {
    if (currentRental) {
      reset({
        title: currentRental.title,
        location: currentRental.location,
        description: currentRental.description,
        duration: currentRental.duration,
        price: currentRental.price,
        status: currentRental.status,
      })

      // Set image preview from current rental
      if (currentRental.imageUrl) {
        setImagePreview(currentRental.imageUrl)
      }
    }
  }, [currentRental, reset])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/webp"]
      const maxSize = 10 * 1024 * 1024 // 10MB

      if (!validTypes.includes(file.type)) {
        setError("root", {
          message:
            "Invalid file type. Please upload a JPEG, PNG, or WEBP image.",
        })
        return
      }

      if (file.size > maxSize) {
        setError("root", {
          message: "File size too large. Maximum size is 10MB.",
        })
        return
      }

      setSelectedFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleRemoveImage = () => {
    setSelectedFile(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.classList.add("ring-2", "ring-blue-500")
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.classList.remove("ring-2", "ring-blue-500")
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.classList.remove("ring-2", "ring-blue-500")

    const file = e.dataTransfer.files?.[0]
    if (file) {
      setSelectedFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const onSubmit = handleSubmit(async (data) => {
    if (!imagePreview && !currentRental?.imageUrl) {
      setError("root", { message: "Please select an image" })
      return
    }

    try {
      setIsSubmitting(true)

      const formData = new FormData()
      formData.append("title", data.title)
      formData.append("description", data.description)
      formData.append("duration", data.duration)
      formData.append("price", data.price.toString())
      formData.append("status", data.status)
      formData.append("location", data.location)

      // Only append new image if selected
      if (selectedFile) {
        formData.append("media", selectedFile)
      }

      if (currentRental?.id) {
        await updateRental({ id: currentRental.id, formData }).unwrap()
        router.push(paths.shared.rental.list)
      }
    } catch (error: any) {
      console.error("Error updating rental:", error)
      setError("root", {
        message: error.data?.message || "Failed to update rental",
      })
    } finally {
      setIsSubmitting(false)
    }
  })

  if (!currentRental) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-600">Loading rental details...</p>
      </div>
    )
  }

  return (
    <div className="">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Edit Rental: {currentRental.title}
      </h1>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Image Upload */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Rental Image *
          </label>

          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
                ${
                  imagePreview
                    ? "border-gray-300"
                    : "border-blue-300 bg-blue-50 hover:bg-blue-100"
                }
                ${isSubmitting ? "opacity-70 pointer-events-none" : ""}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg, image/png, image/webp"
              className="hidden"
              disabled={isSubmitting}
            />

            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mx-auto max-h-60 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveImage()
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <p className="text-gray-600">
                  <span className="text-blue-600 font-medium">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  JPEG, PNG, WEBP (Max 10MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title *
            </label>
            <input
              id="title"
              type="text"
              {...register("title")}
              className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                errors.title
                  ? "border-red-300 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
              placeholder="Rental title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location *
            </label>
            <input
              id="location"
              type="text"
              {...register("location")}
              className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                errors.location
                  ? "border-red-300 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
              placeholder="Rental location"
            />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location.message}</p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price ($) *
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                errors.price
                  ? "border-red-300 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
              placeholder="0.00"
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price.message}</p>
            )}
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-700"
            >
              Duration *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="duration"
                {...register("duration")}
                className={`w-full pl-10 px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                  errors.duration
                    ? "border-red-300 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
                disabled={isSubmitting}
                placeholder="e.g., 2 hours, 1 week, 6 month"
              />
            </div>
            {errors.duration && (
              <p className="text-red-500 text-sm">{errors.duration.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Status *
            </label>
            <select
              id="status"
              {...register("status")}
              className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                errors.status
                  ? "border-red-300 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
            >
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Maintenance</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm">{errors.status.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description *
          </label>
          <textarea
            id="description"
            rows={4}
            {...register("description")}
            className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
              errors.description
                ? "border-red-300 focus:ring-red-200"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
            }`}
            placeholder="Describe the rental item..."
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-between">
          <button
            type="button"
            onClick={() => router.push(paths.shared.rental.list)}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg shadow-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
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
              {isSubmitting ? "Updating Rental..." : "Update Rental"}
            </div>
          </button>
        </div>
      </form>

      {errors.root && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
          <FiAlertTriangle className="mr-2" />
          {errors.root.message}
        </div>
      )}
    </div>
  )
}
