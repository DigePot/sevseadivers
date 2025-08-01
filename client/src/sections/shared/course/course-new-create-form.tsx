import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { useRef, useState, useEffect } from "react";

// Zod Schema Definition
const NewCourseSchema = z
  .object({
    title: z.string().min(1, { message: "Title is required!" }),
    description: z.string().min(1, { message: "Description is required!" }),
    price: z.preprocess(
      val => (val === "" || val === undefined ? undefined : Number(val)),
      z.number().min(0, { message: "Price must be positive" }).optional()
    ),
    discountedPrice: z.preprocess(
      val => (val === "" || val === undefined ? undefined : Number(val)),
      z.number().min(0, { message: "Discounted price must be positive" }).optional()
    ),
    duration: z.string().optional(),
    category: z.string().min(1, { message: "Category is required!" }),
    level: z.string().min(1, { message: "Level is required!" }),
    minAge: z.preprocess(
      val => (val === "" || val === undefined ? undefined : Number(val)),
      z.number().min(0).max(120).optional()
    ),
    prerequisites: z.array(z.string()).optional().default([]),
    imageUrl: z
      .custom<File | null>((v) => v instanceof File || v === null)
      .refine((file) => file !== null && file.size > 0, "Image is required")
      .refine(
        (file) =>
          file === null ||
          ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
            file.type
          ),
        "Only JPEG, PNG, GIF, or WebP allowed"
      ),
  })
  .superRefine((data, ctx) => {
    const { price, discountedPrice } = data;
    if (
      typeof discountedPrice === "number" &&
      typeof price === "number" &&
      discountedPrice >= price
    ) {
      ctx.addIssue({
        path: ["discountedPrice"],
        code: z.ZodIssueCode.custom,
        message: "Discounted price must be less than regular price",
      });
    }
  });

// Type Definitions
export type NewCourseSchemaType = z.infer<typeof NewCourseSchema>;

type Props = {
  initialData: NewCourseSchemaType;
  onUpdate: (data: NewCourseSchemaType) => void;
};

export function CourseNewCreateForm({ initialData, onUpdate }: Props) {
  // State Management
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Initialization
  const {
    register,
    setValue,
    getValues,
    formState: { errors, isValid },
    trigger,
    control,
  } = useForm<NewCourseSchemaType>({
    resolver: zodResolver(NewCourseSchema) as any,
    defaultValues: {
      ...initialData,
      prerequisites: initialData.prerequisites ?? [],
      minAge: initialData.minAge ?? undefined,
    },
    mode: "onChange",
  });

  // Watch form values
  const formValues = useWatch({ control });

  // Update parent when form changes (always, not gated on isValid)
  useEffect(() => {
    if (!onUpdate) return;
    onUpdate({
      title: formValues.title ?? "",
      description: formValues.description ?? "",
      category: formValues.category ?? "",
      level: formValues.level ?? "",
      imageUrl: formValues.imageUrl ?? null,
      price: formValues.price,
      discountedPrice: formValues.discountedPrice,
      duration: formValues.duration,
      minAge: formValues.minAge,
      prerequisites: formValues.prerequisites ?? [],
    });
  }, [formValues, onUpdate]);

  // Image Preview Handling
  useEffect(() => {
    if (formValues.imageUrl instanceof File) {
      const url = URL.createObjectURL(formValues.imageUrl);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreview(null);
    }
  }, [formValues.imageUrl]);

  // Initialize image preview from initial data
  useEffect(() => {
    if (initialData.imageUrl instanceof File) {
      const url = URL.createObjectURL(initialData.imageUrl);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [initialData.imageUrl]);

  // File Handling Functions
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setValue("imageUrl", file);
      trigger("imageUrl");
    }
  };

  const handleRemoveImage = () => {
    setValue("imageUrl", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    trigger("imageUrl");
  };

  // Drag and Drop Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (
        ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
          file.type
        )
      ) {
        setValue("imageUrl", file);
        trigger("imageUrl");
      } else {
        alert("Please upload a valid image file (JPEG, PNG, GIF, or WebP)");
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Form Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl lg:text-3xl font-bold text-cyan-700">
          Course Details
        </h2>
        <p className="text-gray-600 mt-2">
          Provide the basic information about your course
        </p>
      </div>

      <div className="space-y-8">
        {/* Image Upload Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Course Image *
            </label>
            <p className="text-xs text-gray-500 mb-4">
              Upload a high-quality image that represents your course
            </p>
          </div>

          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
              ${dragActive ? "border-cyan-400 bg-cyan-50"
              : imagePreview
              ? "border-gray-300 bg-gray-50"
              : errors.imageUrl
              ? "border-red-300 bg-red-50"
              : "border-gray-300 bg-gray-50 hover:border-cyan-400 hover:bg-cyan-50"}`}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg, image/png, image/gif, image/webp"
              className="hidden"
            />

            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Course preview"
                  className="mx-auto max-h-64 object-contain rounded-lg shadow-sm"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  title="Remove image"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-16 w-16 mx-auto transition-colors ${
                      dragActive ? "text-cyan-500" : "text-gray-400"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-700 font-medium">
                    <span className="text-cyan-600 font-semibold">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    JPEG, PNG, GIF, WebP
                  </p>
                </div>
              </div>
            )}
          </div>
          {errors.imageUrl && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.imageUrl.message}
            </p>
          )}
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Title Field */}
          <div className="lg:col-span-2 space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Course Title *
            </label>
            <input
              {...register("title")}
              className={`w-full px-4 py-3 rounded-lg border transition-all ${
                errors.title ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter an engaging course title..."
            />
            {errors.title && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Category Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Category *
            </label>
            <select
              {...register("category")}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.category ? "border-red-300" : "border-gray-300"
              }`}
            >
              <option value="">Select a category</option>
              <option value="General">General</option>
              <option value="Diving">Diving</option>
              <option value="Swimming">Swimming</option>
              <option value="Water safety">Water safety</option>
              <option value="Snorkeling">Snorkeling</option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>

          {/* Level Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Difficulty Level *
            </label>
            <select
              {...register("level")}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.level ? "border-red-300" : "border-gray-300"
              }`}
            >
              <option value="">Select level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Professional</option>
            </select>
            {errors.level && (
              <p className="text-red-500 text-sm">{errors.level.message}</p>
            )}
          </div>

          {/* Price Fields */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Price (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                {...register("price")}
                className={`w-full pl-8 pr-4 py-3 rounded-lg border ${
                  errors.price ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="0.00"
                type="number"
                step="0.01"
                min="0"
              />
            </div>
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price.message}</p>
            )}
            <p className="text-xs text-gray-500">Leave empty for free course</p>
          </div>

          {/* Discounted Price Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Discounted Price (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                {...register("discountedPrice")}
                className={`w-full pl-8 pr-4 py-3 rounded-lg border ${
                  errors.discountedPrice ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Optional"
                type="number"
                step="0.01"
                min="0"
              />
            </div>
            {errors.discountedPrice && (
              <p className="text-red-500 text-sm">
                {errors.discountedPrice.message}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Must be less than regular price
            </p>
          </div>

          {/* Duration Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Duration
            </label>
            <input
              {...register("duration")}
              className="w-full px-4 py-3 rounded-lg border border-gray-300"
              placeholder="e.g., 2 hours, 1 week, 6 sessions"
            />
            <p className="text-xs text-gray-500">
              Estimated time to complete
            </p>
          </div>

          {/* Minimum Age Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Minimum Age
            </label>
            <input
              {...register("minAge")}
              className="w-full px-4 py-3 rounded-lg border border-gray-300"
              placeholder="Leave empty for no age restriction"
              type="number"
              min="0"
              max="120"
            />
            <p className="text-xs text-gray-500">
              Recommended for age-restricted courses
            </p>
          </div>
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Course Description *
          </label>
          <textarea
            {...register("description")}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.description ? "border-red-300" : "border-gray-300"
            }`}
            rows={6}
            placeholder="Provide a detailed description..."
          />
          {errors.description && (
            <p className="text-red-500 text-sm">
              {errors.description.message}
            </p>
          )}
          <div className="flex justify-between text-xs text-gray-500">
            <span>Write a compelling description</span>
            <span>{formValues.description?.length || 0} characters</span>
          </div>
        </div>

        {/* Prerequisites Section */}
        <div className="lg:col-span-2 space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Prerequisites
          </label>
          <div className="flex flex-col space-y-2">
            {getValues("prerequisites")?.map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  {...register(`prerequisites.${index}` as const)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300"
                  placeholder="Enter prerequisite"
                />
                <button
                  type="button"
                  onClick={() => {
                    const current = getValues("prerequisites") || [];
                    setValue(
                      "prerequisites",
                      current.filter((_, i) => i !== index)
                    );
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const current = getValues("prerequisites") || [];
                setValue("prerequisites", [...current, ""]);
              }}
              className="flex items-center gap-2 text-cyan-600 hover:text-cyan-800 text-sm font-medium"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Prerequisite
            </button>
          </div>
          <p className="text-xs text-gray-500">
            List any requirements students should meet
          </p>
        </div>

        {/* Form Status */}
        <div
          className={`p-4 rounded-lg border-l-4 ${
            isValid ? "bg-green-50 border-green-400" : "bg-yellow-50 border-yellow-400"
          }`}
        >
          <div className="flex items-center">
            <div
              className={`flex-shrink-0 ${
                isValid ? "text-green-400" : "text-yellow-400"
              }`}
            >
              {isValid ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p
                className={`text-sm font-medium ${
                  isValid ? "text-green-800" : "text-yellow-800"
                }`}
              >
                {isValid
                  ? "All required fields completed!"
                  : "Please complete all required fields to proceed"}
              </p>
              {!isValid && (
                <p className="text-xs text-yellow-700 mt-1">
                  Required: Course title, description, category, level, and image
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
