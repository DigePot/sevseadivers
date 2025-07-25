import { zodResolver } from "@hookform/resolvers/zod"
import { useRef, useState, useEffect } from "react" // Added useEffect
import { useForm } from "react-hook-form"
import { z as zod } from "zod"
import { useRouter } from "../../../routes/hooks"
import { paths } from "../../../routes/paths"
import { useUpdateCourseMutation } from "../../../store/course"
import type { Course } from "../../../types/course"

// ----------------------------------------------------------------------

export const CourseSchema = zod.object({
  title: zod.string().min(1, { message: "Title is required!" }),
  description: zod.string().min(1, { message: "Description is required!" }),
  price: zod.number().min(0, { message: "Price must be positive" }).optional(),
  duration: zod.string().optional(),
  category: zod.string().min(1, { message: "Category is required!" }),
  level: zod.string().min(1, { message: "Level is required!" }),
  instructorName: zod.string().min(1, { message: "Instructor name is required!" }),
})

export type CourseSchemaType = zod.infer<typeof CourseSchema>

// ----------------------------------------------------------------------

type Props = {
  currentCourse?: Course | null
}

export function CourseEditForm({ currentCourse }: Props) {
  console.log(currentCourse)
  const router = useRouter()
  const [updateCourse] = useUpdateCourseMutation()

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
  } = useForm<CourseSchemaType>({
    resolver: zodResolver(CourseSchema),
    defaultValues: {
      title: "",
      description: "",
      price: undefined,
      duration: undefined,
      category: "",
      level: "Beginner",
      instructorName: "",
    },
  })

  // Reset form when currentCourse changes
  useEffect(() => {
    if (currentCourse) {
      reset({
        title: currentCourse.title,
        description: currentCourse.description,
        price: currentCourse.price,
        duration: currentCourse.duration,
        category: currentCourse.category || "",
        level: currentCourse.level || "",
        instructorName: currentCourse.instructorName || "",

      })

      // Set image preview from current course
      if (currentCourse.imageUrl) {
        setImagePreview(currentCourse.imageUrl)
      }
    }
  }, [currentCourse, reset])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"]
      const maxSize = 10 * 1024 * 1024 // 10MB

      if (!validTypes.includes(file.type)) {
        setError("root", {
          message:
            "Invalid file type. Please upload a JPEG, PNG, or GIF image.",
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
    if (!imagePreview && !currentCourse?.imageUrl) {
      setError("root", { message: "Please select an image" })
      return
    }

    try {
      setIsSubmitting(true)

      const formData = new FormData()
      formData.append("title", data.title)
      formData.append("description", data.description)
      if (data.price !== undefined) {
        formData.append("price", data.price?.toString() || "")
      }
      if (data.duration !== undefined) {
        formData.append("duration", data.duration || "")
      
      }
      formData.append("category", data.category || "")
      formData.append("level", data.level || "")
      formData.append("instructorName", data.instructorName || "")

      // Only append new image if selected
      if (selectedFile) {
        formData.append("media", selectedFile)
      }

      if (currentCourse?.id) {
        await updateCourse({ id: currentCourse.id, formData }).unwrap()
        router.push(paths.shared.course.list)
      }
    } catch (error: any) {
      console.error("Error updating course:", error)
      setError("root", {
        message: error.data?.message || "Failed to update course",
      })
    } finally {
      setIsSubmitting(false)
    }
  })

  if (!currentCourse) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-600">Loading course details...</p>
      </div>
    )
  }

  return (
    <div className="">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Edit Course: {currentCourse.title}
      </h1>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Image Upload */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Course Image *
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
              accept="image/jpeg, image/png, image/gif"
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
                  JPEG, PNG, GIF (Max 10MB)
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
              placeholder="Course title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price ($)
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
              placeholder="Optional"
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
              Duration
            </label>
            <input
              id="duration"
              type="text"
              {...register("duration")}
              className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                errors.duration
                  ? "border-red-300 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
              placeholder="Optional e.g., 1 hour, 3 weeks"
            />
            {errors.duration && (
              <p className="text-red-500 text-sm">{errors.duration.message}</p>
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
            placeholder="Describe the course content..."
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
  <label
    htmlFor="category"
    className="block text-sm font-medium text-gray-700"
  >
    Category *
  </label>
  <select
    id="category"
    {...register("category", { required: "Category is required" })}
    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
      errors.category
        ? "border-red-300 focus:ring-red-200"
        : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
    }`}
  >
    <option value="">Select a category</option>
    <option value="Diving">Diving</option>
    <option value="Snorkeling">Snorkeling</option>
    <option value="Swimming">Swimming</option>
  </select>
  {errors.category && (
    <p className="text-red-500 text-sm">{errors.category.message}</p>
  )}
</div>

  

<div className="space-y-2">
  <label
    htmlFor="level"
    className="block text-sm font-medium text-gray-700"
  >
    Level *
  </label>
  <select
    id="level"
    {...register("level", { required: "Level is required" })}
    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
      errors.level
        ? "border-red-300 focus:ring-red-200"
        : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
    }`}
  >
    <option value="">Select level</option>
    <option value="Beginner">Beginner</option>
    <option value="Intermediate">Intermediate</option>
    <option value="Advanced">Advanced</option>
  </select>
  {errors.level && (
    <p className="text-red-500 text-sm">{errors.level.message}</p>
  )}
</div>


{/* Instructor Name */}
<div className="space-y-2">
  <label
    htmlFor="instructorName"
    className="block text-sm font-medium text-gray-700"
  >
    Instructor Name *
  </label>
  <input
    id="instructorName"
    type="text"
    {...register("instructorName", {
      required: "Instructor name is required",
    })}
    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
      errors.instructorName
        ? "border-red-300 focus:ring-red-200"
        : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
    }`}
    placeholder="Instructor full name"
  />
  {errors.instructorName && (
    <p className="text-red-500 text-sm">{errors.instructorName.message}</p>
  )}
</div>


        {/* Submit Button */}
        <div className="pt-4 flex justify-between">
          <button
            type="button"
            onClick={() => router.push(paths.shared.course.list)}
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
              {isSubmitting ? "Updating Course..." : "Update Course"}
            </div>
          </button>
        </div>
      </form>

      {errors.root && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
          {errors.root.message}
        </div>
      )}
    </div>
  )
}
