import { zodResolver } from "@hookform/resolvers/zod"
import { useRef, useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z as zod } from "zod"
import { useRouter } from "../../../routes/hooks"
import { paths } from "../../../routes/paths"
import { useUpdateCourseMutation } from "../../../store/course"
import type { Course } from "../../../types/course"
import { useGetAllStaffQuery } from "../../../store/staff";

// ----------------------------------------------------------------------
// VALIDATION SCHEMA
// ----------------------------------------------------------------------

export const CourseSchema = zod.object({
  title: zod.string().min(1, { message: "Title is required!" }),
  description: zod.string().min(1, { message: "Description is required!" }),
  price: zod.preprocess((val) => {
    if (val === "" || val == null) return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  }, zod.number().min(0, { message: "Price must be positive" }).optional()),
  discountedPrice: zod.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    zod.number().min(0).optional()
  ),
  duration: zod.string().optional(),
  category: zod.string().min(1, { message: "Category is required!" }),
  level: zod.string().min(1, { message: "Level is required!" }),
  staffId: zod.string().min(1, "Staff selection is required"),
  instructorName: zod.string().optional(),
  instructorBio: zod.string().max(500, "Bio must be under 500 characters").optional(),
  instructorRating: zod
    .number({ invalid_type_error: "Must be a number" })
    .min(0)
    .max(5)
    .optional(),
  instructorImageUrl: zod.string().optional(),
  minAge: zod.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    zod.number().min(0).optional()
  ),
  videoFile: zod
    .instanceof(File)
    .nullable()
    .optional()
    .refine(
      (file) => file === null || file === undefined || ["video/mp4", "video/webm", "video/ogg"].includes(file.type),
      { message: "Only MP4, WebM, and Ogg formats are supported" }
    ),
  learnPoints: zod
    .array(zod.string())
    .transform(arr => arr.filter(item => item.trim() !== ""))
    .refine(arr => arr.length > 0, "Add at least one learning point"),
  includes: zod
    .array(
      zod.object({
        icon: zod.string(),
        text: zod.string(),
      })
    )
    .transform(arr => arr.filter(item => item.icon.trim() !== "" && item.text.trim() !== ""))
    .refine(arr => arr.length > 0, "Add at least one include"),
  prerequisites: zod
    .array(zod.string())
    .transform(arr => arr.filter(item => item.trim() !== ""))
    .optional()
    .default([]),
}).superRefine((data, ctx) => {
  if (
    typeof data.price === "number" &&
    typeof data.discountedPrice === "number" &&
    data.discountedPrice >= data.price
  ) {
    ctx.addIssue({
      code: zod.ZodIssueCode.custom,
      message: "Discounted price must be less than regular price",
      path: ["discountedPrice"],
    });
  }
});

export type CourseSchemaType = zod.infer<typeof CourseSchema>

// ----------------------------------------------------------------------
// COMPONENT PROPS & STATE SETUP
// ----------------------------------------------------------------------

type Props = {
  currentCourse?: Course | null
}

export function CourseEditForm({ currentCourse }: Props) {
  const router = useRouter()
  const [updateCourse] = useUpdateCourseMutation()
  const { data: staffList } = useGetAllStaffQuery();

  // Course Image States
  const [courseImagePreview, setCourseImagePreview] = useState<string | null>(null)
  const [selectedCourseFile, setSelectedCourseFile] = useState<File | null>(null)
  const courseFileInputRef = useRef<HTMLInputElement>(null)

  // Instructor Image States
  const [instructorImagePreview, setInstructorImagePreview] = useState<string | null>(null)
  const [selectedInstructorFile, setSelectedInstructorFile] = useState<File | null>(null)
  const instructorFileInputRef = useRef<HTMLInputElement>(null)

  // Video States
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const videoInputRef = useRef<HTMLInputElement | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
    setError,
  } = useForm<CourseSchemaType>({
    resolver: zodResolver(CourseSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      price: undefined,
      discountedPrice: undefined,
      duration: "",
      category: "",
      level: "",
      staffId: "",
      instructorName: "",
      instructorBio: "",
      instructorRating: 0,
      instructorImageUrl: "",
      learnPoints: [""],
      includes: [{ icon: "", text: "" }],
      prerequisites: [""],
      minAge: undefined,
    },
  })

  // Reset form when currentCourse changes
  useEffect(() => {
    if (currentCourse) {
      reset({
        title: currentCourse.title || "",
        description: currentCourse.description || "",
        price: currentCourse.price || undefined,
        discountedPrice: currentCourse.discountedPrice || undefined,
        duration: currentCourse.duration || "",
        category: currentCourse.category || "",
        level: currentCourse.level || "",
        staffId: currentCourse.staffId?.toString() || "",
        instructorName: currentCourse.instructorName || "",
        instructorBio: currentCourse.instructorBio || "",
        instructorRating: currentCourse.instructorRating || 0,
        instructorImageUrl: currentCourse.instructorImage || "",
        learnPoints: Array.isArray(currentCourse.whatYouWillLearn) && currentCourse.whatYouWillLearn.length > 0 
          ? currentCourse.whatYouWillLearn 
          : [""],
        includes: Array.isArray(currentCourse.includes) && currentCourse.includes.length > 0 
          ? currentCourse.includes 
          : [{ icon: "", text: "" }],
        prerequisites: Array.isArray(currentCourse.prerequisites) && currentCourse.prerequisites.length > 0 
          ? currentCourse.prerequisites 
          : [""],
        minAge: currentCourse.minAge || undefined,
      });

      // Set image previews from current course
      if (currentCourse.imageUrl) {
        setCourseImagePreview(currentCourse.imageUrl);
      }
      if (currentCourse.instructorImage) {
        setInstructorImagePreview(currentCourse.instructorImage);
      }
      if (currentCourse.videoUrl) {
        setVideoPreview(currentCourse.videoUrl);
      }
    }
  }, [currentCourse, reset]);

  // Course Image Handlers
  const handleCourseFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"]
      const maxSize = 10 * 1024 * 1024 // 10MB

      if (!validTypes.includes(file.type)) {
        setError("root", {
          message: "Invalid file type. Please upload a JPEG, PNG, or GIF image.",
        })
        return
      }

      if (file.size > maxSize) {
        setError("root", {
          message: "File size too large. Maximum size is 10MB.",
        })
        return
      }

      setSelectedCourseFile(file)
      setCourseImagePreview(URL.createObjectURL(file))
    }
  }

  const handleRemoveCourseImage = () => {
    setSelectedCourseFile(null)
    setCourseImagePreview(null)
    if (courseFileInputRef.current) {
      courseFileInputRef.current.value = ""
    }
  }

  // Staff selection
  const handleStaffSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStaffId = e.target.value;
    setValue("staffId", newStaffId, { shouldValidate: true });

    const selectedStaff = staffList?.find((s) => s.id.toString() === newStaffId);

    if (selectedStaff) {
      setValue("instructorName", selectedStaff.fullName, { shouldValidate: true });
      setValue("instructorBio", selectedStaff.bio || "", { shouldValidate: true });
      setValue("instructorRating", 4.5, { shouldValidate: true });

      const baseUrl = "https://api.sevseadivers.com";
      if (selectedStaff.profilePicture) {
        const profilePic = selectedStaff.profilePicture.startsWith("/") 
          ? selectedStaff.profilePicture 
          : `/${selectedStaff.profilePicture}`;
        setValue("instructorImageUrl", `${baseUrl}${profilePic}`, { shouldValidate: true });
        setInstructorImagePreview(`${baseUrl}${profilePic}`);
      } else {
        setValue("instructorImageUrl", "", { shouldValidate: true });
        setInstructorImagePreview(null);
      }
    }
  };

  // Instructor Image Handlers
  const handleInstructorFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/webp"]
      const maxSize = 5 * 1024 * 1024 // 5MB

      if (!validTypes.includes(file.type)) {
        setError("root", {
          message: "Invalid instructor image type. Please upload JPG, PNG, or WEBP.",
        })
        return
      }

      if (file.size > maxSize) {
        setError("root", {
          message: "Instructor image too large. Maximum size is 5MB.",
        })
        return
      }

      setSelectedInstructorFile(file)
      setInstructorImagePreview(URL.createObjectURL(file))
      setValue("instructorImageUrl", URL.createObjectURL(file))
    }
  }

  const handleRemoveInstructorImage = () => {
    setSelectedInstructorFile(null)
    setInstructorImagePreview(null)
    setValue("instructorImageUrl", "")
    if (instructorFileInputRef.current) {
      instructorFileInputRef.current.value = ""
    }
  }

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.classList.add("ring-2", "ring-blue-500")
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.classList.remove("ring-2", "ring-blue-500")
  }

  const handleCourseDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.classList.remove("ring-2", "ring-blue-500")

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setSelectedCourseFile(file)
      setCourseImagePreview(URL.createObjectURL(file))
    }
  }

  const handleInstructorDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.classList.remove("ring-2", "ring-blue-500")

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setSelectedInstructorFile(file)
      setInstructorImagePreview(URL.createObjectURL(file))
      setValue("instructorImageUrl", URL.createObjectURL(file))
    }
  }

  // Video Handlers
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
      setVideoPreview(URL.createObjectURL(file))
      setValue("videoFile", file)
    }
  }

  const handleVideoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file)
      setVideoPreview(URL.createObjectURL(file))
      setValue("videoFile", file)
    }
  }

  const handleRemoveVideo = () => {
    setVideoFile(null)
    setVideoPreview(null)
    setValue("videoFile", null)
    if (videoInputRef.current) {
      videoInputRef.current.value = ""
    }
  }

  // Learn Points Handlers
  const addLearnPoint = () => {
    const currentPoints = watch("learnPoints")
    setValue("learnPoints", [...currentPoints, ""])
  }

  const removeLearnPoint = (index: number) => {
    const currentPoints = watch("learnPoints")
    if (currentPoints.length > 1) {
      setValue("learnPoints", currentPoints.filter((_, i) => i !== index))
    }
  }

  // Includes Handlers
  const addInclude = () => {
    const currentIncludes = watch("includes")
    setValue("includes", [...currentIncludes, { icon: "", text: "" }])
  }

  const removeInclude = (index: number) => {
    const currentIncludes = watch("includes")
    if (currentIncludes.length > 1) {
      setValue("includes", currentIncludes.filter((_, i) => i !== index))
    }
  }

  // Prerequisites Handlers
  const addPrerequisite = () => {
    const currentPrerequisites = watch("prerequisites");
    setValue("prerequisites", [...currentPrerequisites, ""]);
  }

  const removePrerequisite = (index: number) => {
    const currentPrerequisites = watch("prerequisites");
    if (currentPrerequisites.length > 1) {
      setValue("prerequisites", currentPrerequisites.filter((_, i) => i !== index));
    }
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      console.log("Form data before processing:", data);

      const formData = new FormData();

      // Required fields - always append
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("level", data.level);
      formData.append("staffUserId", data.staffId);
      formData.append("instructorName", data.instructorName || "");

      // Numeric fields - handle undefined/null cases
      formData.append("price", data.price?.toString() ?? "");
      formData.append("discountedPrice", data.discountedPrice?.toString() ?? "");
      formData.append("instructorRating", data.instructorRating?.toString() ?? "0");
      formData.append("minAge", data.minAge?.toString() ?? "");

      // Optional text fields
      if (data.duration) formData.append("duration", data.duration);
      formData.append("instructorBio", data.instructorBio || "");
      formData.append("instructorImageUrl", data.instructorImageUrl || "");

      // Array fields - send empty arrays if no valid data
      formData.append("whatYouWillLearn", JSON.stringify(data.learnPoints || []));
      formData.append("includes", JSON.stringify(data.includes || []));
      formData.append("prerequisites", JSON.stringify(data.prerequisites || []));

      // File uploads - only if files exist
      if (selectedCourseFile) formData.append("courseImage", selectedCourseFile);
      if (selectedInstructorFile) formData.append("instructorImage", selectedInstructorFile);
      if (videoFile) formData.append("curriculumVideo", videoFile);

      // Debug output
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      if (currentCourse?.id) {
        await updateCourse({ id: currentCourse.id, formData }).unwrap();
        router.push(paths.shared.course.list);
      }
    } catch (error: any) {
      console.error("Error updating course:", error);
      setError("root", {
        message: error.data?.message || "Failed to update course",
      });
    } finally {
      setIsSubmitting(false);
    }
  });

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

      {errors.root && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
          {errors.root.message}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Course Image Upload */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Course Image *
          </label>

          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
                  ${
                    courseImagePreview
                      ? "border-gray-300"
                      : "border-blue-300 bg-blue-50 hover:bg-blue-100"
                  }
                  ${isSubmitting ? "opacity-70 pointer-events-none" : ""}`}
            onClick={() => courseFileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleCourseDrop}
          >
            <input
              type="file"
              ref={courseFileInputRef}
              onChange={handleCourseFileChange}
              accept="image/jpeg, image/png, image/gif"
              className="hidden"
              disabled={isSubmitting}
            />

            {courseImagePreview ? (
              <div className="relative">
                <img
                  src={courseImagePreview}
                  alt="Course Preview"
                  className="mx-auto max-h-60 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveCourseImage()
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

          {/* Discount Price */}
          <div className="space-y-2">
            <label htmlFor="discountedPrice" className="block text-sm font-semibold text-gray-700">
              Discounted Price (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                id="discountedPrice"
                type="number"
                step="0.01"
                min="0"
                {...register("discountedPrice", { valueAsNumber: true })}
                className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:outline-none"
                placeholder="Optional"
              />
            </div>
            <p className="text-xs text-gray-500">Optional — Leave empty if no discount</p>
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

        {/* Category and Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <option value="Water Safety">Water Safety</option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>

          {/* Level */}
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
        </div>

        {/* Staff Selection */}
        <div className="space-y-2">
          <label
            htmlFor="staffId"
            className="block text-sm font-medium text-gray-700"
          >
            Instructor (Staff Member) *
          </label>
          <select
            id="staffId"
            {...register("staffId")}
            onChange={handleStaffSelect}
            className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
              errors.staffId
                ? "border-red-300 focus:ring-red-200"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
            }`}
          >
            <option value="">Select an instructor</option>
            {staffList?.map((staff) => (
              <option key={staff.id} value={staff.id.toString()}>
                {staff.fullName}
              </option>
            ))}
          </select>
          {errors.staffId && (
            <p className="text-red-500 text-sm">{errors.staffId.message}</p>
          )}
        </div>

        {/* Instructor Section */}
        <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800">Instructor Information</h3>
          
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
              {...register("instructorName")}
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

          {/* Rating */}
          <div>
            <label className="block font-medium mb-2 text-gray-700">Instructor Rating (0-5) *</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              {...register("instructorRating", { valueAsNumber: true })}
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            {errors.instructorRating && (
              <p className="text-red-600 text-sm mt-1">{errors.instructorRating.message}</p>
            )}
          </div>

          {/* Instructor Bio */}
          <div>
            <label className="block font-medium mb-2 text-gray-700">Instructor Bio *</label>
            <textarea
              rows={4}
              {...register("instructorBio")}
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            {errors.instructorBio && (
              <p className="text-red-600 text-sm mt-1">{errors.instructorBio.message}</p>
            )}
          </div>

          {/* Instructor Image Upload */}
          <div>
            <label className="block font-medium mb-2 text-gray-700">Instructor Image *</label>

            <div
              onClick={() => instructorFileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleInstructorDrop}
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-xl cursor-pointer hover:border-blue-400 transition"
            >
              {instructorImagePreview ? (
                <div className="relative">
                  <img
                    src={instructorImagePreview}
                    alt="Instructor Preview"
                    className="w-32 h-32 object-cover rounded-full border"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveInstructorImage()
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-100 border mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium text-sm">
                    Click or drag image here
                  </p>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG, or WEBP up to 5MB</p>
                </>
              )}
            </div>

            <input
              ref={instructorFileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleInstructorFileChange}
              className="hidden"
            />

            {errors.instructorImageUrl && (
              <p className="text-red-600 text-sm mt-1">{errors.instructorImageUrl.message}</p>
            )}
          </div>
        </div>

        {/* Video Upload */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Course Video *
          </label>
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
              ${
                videoPreview
                  ? "border-gray-300"
                  : "border-blue-300 bg-blue-50 hover:bg-blue-100"
              }
              ${isSubmitting ? "opacity-70 pointer-events-none" : ""}`}
            onClick={() => videoInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleVideoDrop}
          >
            <input
              type="file"
              ref={videoInputRef}
              onChange={handleVideoChange}
              accept="video/mp4, video/webm"
              className="hidden"
              disabled={isSubmitting}
            />

            {videoPreview ? (
              <div className="relative">
                <video
                  src={videoPreview}
                  controls
                  className="mx-auto max-h-60 rounded-lg"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveVideo()
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
                      d="M15 10l4.553 2.276A1 1 0 0120 13.118v.764a1 1 0 01-.447.842L15 17V10z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 6v12M4 18h16"
                    />
                  </svg>
                </div>
                <p className="text-gray-600">
                  <span className="text-blue-600 font-medium">Click to upload</span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500">MP4, WebM (Max 100MB)</p>
              </div>
            )}
          </div>
          {errors.videoFile && (
            <p className="text-red-500 text-sm">{errors.videoFile.message}</p>
          )}
        </div>

        {/* Learn Points */}
        <div>
          <label className="block font-medium mb-3 text-gray-700">What You Will Learn *</label>
          <div className="space-y-3">
            {(watch("learnPoints") || []).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                </div>
                <input
                  type="text"
                  placeholder={`Learning point ${index + 1}`}
                  {...register(`learnPoints.${index}`)}
                  className={`flex-grow border ${
                    errors.learnPoints?.[index] ? "border-red-300" : "border-gray-300"
                  } p-3 rounded-lg focus:ring-2 focus:ring-blue-200`}
                />
                {watch("learnPoints").length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLearnPoint(index)}
                    className="text-red-500 hover:text-red-700 p-1 transition-colors"
                    title="Remove learning point"
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
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addLearnPoint}
            className="flex items-center mt-3 text-blue-600 font-medium hover:text-blue-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add another learning point
          </button>
          {errors.learnPoints && (
            <p className="text-red-600 text-sm mt-2">{errors.learnPoints.message as string}</p>
          )}
        </div>

        {/* Includes Section */}
        <div>
          <label className="block font-medium mb-3 text-gray-700">This course includes: *</label>
          <div className="space-y-4">
            {(watch("includes") || []).map((_, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                {/* Icon input */}
                <div>
                  <input
                    type="text"
                    placeholder={`Icon ${index + 1} (e.g. video, article, lifetime)`}
                    {...register(`includes.${index}.icon`)}
                    className={`w-full border ${
                      errors.includes?.[index]?.icon ? "border-red-300" : "border-gray-300"
                    } p-3 rounded-lg focus:ring-2 focus:ring-blue-200`}
                  />
                  {errors.includes?.[index]?.icon && (
                    <p className="text-red-600 text-sm mt-1">{errors.includes[index]?.icon?.message}</p>
                  )}
                </div>

                {/* Text input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`Text ${index + 1}`}
                    {...register(`includes.${index}.text`)}
                    className={`w-full border ${
                      errors.includes?.[index]?.text ? "border-red-300" : "border-gray-300"
                    } p-3 rounded-lg focus:ring-2 focus:ring-blue-200`}
                  />
                  {watch("includes").length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInclude(index)}
                      className="text-red-500 hover:text-red-700 p-2 transition-colors"
                      title="Remove include"
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
                  )}
                </div>

                {errors.includes?.[index]?.text && (
                  <p className="text-red-600 text-sm md:col-span-2">{errors.includes[index]?.text?.message}</p>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addInclude}
            className="flex items-center mt-4 text-blue-600 font-medium hover:text-blue-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add another include
          </button>

          {errors.includes && typeof errors.includes?.message === "string" && (
            <p className="text-red-600 text-sm mt-2">{errors.includes.message}</p>
          )}
        </div>

        {/* Minimum Age */}
        <div className="space-y-2">
          <label
            htmlFor="minAge"
            className="block text-sm font-medium text-gray-700"
          >
            Minimum Age (Optional)
          </label>
          <input
            id="minAge"
            type="number"
            min="0"
            max="120"
            {...register("minAge", { valueAsNumber: true })}
            className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
              errors.minAge
                ? "border-red-300 focus:ring-red-200"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
            }`}
            placeholder="Leave empty for no age restriction"
          />
          {errors.minAge && (
            <p className="text-red-500 text-sm">{errors.minAge.message}</p>
          )}
        </div>

        {/* Prerequisites Section */}
        <div className="space-y-4">
          <label className="block font-medium text-gray-700">Prerequisites *</label>
          
          <div className="space-y-3">
            {(watch("prerequisites") || []).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                </div>
                <input
                  type="text"
                  placeholder={`Prerequisite ${index + 1}`}
                  {...register(`prerequisites.${index}`)}
                  className={`flex-grow border ${
                    errors.prerequisites?.[index] ? "border-red-300" : "border-gray-300"
                  } p-3 rounded-lg focus:ring-2 focus:ring-blue-200`}
                />
                {watch("prerequisites").length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePrerequisite(index)}
                    className="text-red-500 hover:text-red-700 p-1 transition-colors"
                    title="Remove prerequisite"
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
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addPrerequisite}
            className="flex items-center mt-2 text-blue-600 font-medium hover:text-blue-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add another prerequisite
          </button>

          {errors.prerequisites && (
            <p className="text-red-600 text-sm mt-2">{errors.prerequisites.message}</p>
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
    </div>
  )
}