import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { useRef, useState, useEffect } from "react";

// Zod Schema
const NewCourseSchema = z.object({
  title: z.string().min(1, { message: "Title is required!" }),
  description: z.string().min(1, { message: "Description is required!" }),
  price: z.number().min(0, { message: "Price must be positive" }).optional(),
  duration: z.string().optional(),
  category: z.string().min(1, { message: "Category is required!" }),
  level: z.string().min(1, { message: "Level is required!" }),
  imageUrl: z
    .custom<File | null>((v) => v instanceof File || v === null)
    .refine(
      (file) => file !== null && file.size > 0,
      "Image is required"
    )
    .refine(
      (file) => file === null || file.size <= 10 * 1024 * 1024,
      "Max size 10MB"
    )
    .refine(
      (file) =>
        file === null ||
        ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type),
      "Only JPEG, PNG, GIF, or WebP allowed"
    ),
});

export type NewCourseSchemaType = z.infer<typeof NewCourseSchema>;

type Props = {
  initialData: NewCourseSchemaType;
  onUpdate: (data: NewCourseSchemaType) => void;
};

export function CourseNewCreateForm({ initialData, onUpdate }: Props) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    register,
    setValue,
    formState: { errors, isValid },
    trigger,
    control,
  } = useForm<NewCourseSchemaType>({
    resolver: zodResolver(NewCourseSchema),
    defaultValues: initialData,
    mode: "onChange",
  });

  // Watch all form values using useWatch to avoid infinite loop
  const formValues = useWatch({ control });
  
  // Update parent when form changes and form is valid
  useEffect(() => {
    if (isValid && onUpdate) {
      onUpdate({
        title: formValues.title ?? "",
        description: formValues.description ?? "",
        category: formValues.category ?? "",
        level: formValues.level ?? "",
        imageUrl: formValues.imageUrl ?? null,
        price: formValues.price,
        duration: formValues.duration,
      });
    }
  }, [formValues, isValid]); // Removed onUpdate from dependencies since it's now memoized

  // Set up image preview when form data changes
  useEffect(() => {
    if (formValues.imageUrl instanceof File) {
      const url = URL.createObjectURL(formValues.imageUrl);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreview(null);
    }
  }, [formValues.imageUrl]);

  // Initialize image preview if initialData has an image
  useEffect(() => {
    if (initialData.imageUrl instanceof File) {
      const url = URL.createObjectURL(initialData.imageUrl);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [initialData.imageUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setValue("imageUrl", file);
      trigger("imageUrl"); // Trigger validation
    }
  };

  const handleRemoveImage = () => {
    setValue("imageUrl", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    trigger("imageUrl"); // Trigger validation
  };

  // Drag and drop handlers
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
      if (["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)) {
        setValue("imageUrl", file);
        trigger("imageUrl");
      } else {
        alert("Please upload a valid image file (JPEG, PNG, GIF, or WebP)");
      }
    }
  };

  return (
    <div className="space-y-8">
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
              Upload a high-quality image that represents your course (Max 10MB)
            </p>
          </div>

          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                  ${dragActive 
                    ? "border-cyan-400 bg-cyan-50" 
                    : imagePreview
                    ? "border-gray-300 bg-gray-50"
                    : errors.imageUrl
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 bg-gray-50 hover:border-cyan-400 hover:bg-cyan-50"
                  }`}
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
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                    JPEG, PNG, GIF, WebP (Max 10MB)
                  </p>
                </div>
              </div>
            )}
          </div>
          {errors.imageUrl && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.imageUrl.message}
            </p>
          )}
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Title */}
          <div className="lg:col-span-2 space-y-2">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
              Course Title *
            </label>
            <input
              id="title"
              type="text"
              {...register("title")}
              className={`w-full px-4 py-3 rounded-lg border transition-all focus:ring-2 focus:outline-none ${
                errors.title
                  ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                  : "border-gray-300 focus:border-cyan-500 focus:ring-cyan-200"
              }`}
              placeholder="Enter an engaging course title..."
            />
            {errors.title && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700">
              Category *
            </label>
            <select
              id="category"
              {...register("category")}
              className={`w-full px-4 py-3 rounded-lg border transition-all focus:ring-2 focus:outline-none ${
                errors.category
                  ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                  : "border-gray-300 focus:border-cyan-500 focus:ring-cyan-200"
              }`}
            >
              <option value="">Select a category</option>
              <option value="General">General</option>
              <option value="Diving">Diving</option>
              <option value="Snorkeling">Snorkeling</option>
              <option value="Swimming">Swimming</option>
              <option value="Water Safety">Water Safety</option>
              <option value="Marine Biology">Marine Biology</option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.category.message}
              </p>
            )}
          </div>
          
          {/* Level */}
          <div className="space-y-2">
            <label htmlFor="level" className="block text-sm font-semibold text-gray-700">
              Difficulty Level *
            </label>
            <select
              id="level"
              {...register("level")}
              className={`w-full px-4 py-3 rounded-lg border transition-all focus:ring-2 focus:outline-none ${
                errors.level
                  ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                  : "border-gray-300 focus:border-cyan-500 focus:ring-cyan-200"
              }`}
            >
              <option value="">Select difficulty level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
            {errors.level && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.level.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label htmlFor="price" className="block text-sm font-semibold text-gray-700">
              Price (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                {...register("price", { valueAsNumber: true })}
                className={`w-full pl-8 pr-4 py-3 rounded-lg border transition-all focus:ring-2 focus:outline-none ${
                  errors.price
                    ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                    : "border-gray-300 focus:border-cyan-500 focus:ring-cyan-200"
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.price && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.price.message}
              </p>
            )}
            <p className="text-xs text-gray-500">Leave empty for free course</p>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label htmlFor="duration" className="block text-sm font-semibold text-gray-700">
              Duration
            </label>
            <input
              id="duration"
              type="text"
              {...register("duration")}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-cyan-200 focus:ring-2 focus:outline-none transition-all"
              placeholder="e.g., 2 hours, 1 week, 6 sessions"
            />
            <p className="text-xs text-gray-500">Estimated time to complete</p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
            Course Description *
          </label>
          <textarea
            id="description"
            rows={6}
            {...register("description")}
            className={`w-full px-4 py-3 rounded-lg border transition-all focus:ring-2 focus:outline-none resize-none ${
              errors.description
                ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                : "border-gray-300 focus:border-cyan-500 focus:ring-cyan-200"
            }`}
            placeholder="Provide a detailed description of what students will learn in this course. Include key topics, skills they'll gain, and what makes this course unique..."
          />
          {errors.description && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.description.message}
            </p>
          )}
          <div className="flex justify-between text-xs text-gray-500">
            <span>Write a compelling description that attracts students</span>
            <span>{formValues.description?.length || 0} characters</span>
          </div>
        </div>

        {/* Form Status Indicator */}
        <div className={`p-4 rounded-lg border-l-4 ${
          isValid 
            ? "bg-green-50 border-green-400" 
            : "bg-yellow-50 border-yellow-400"
        }`}>
          <div className="flex items-center">
            <div className={`flex-shrink-0 ${
              isValid ? "text-green-400" : "text-yellow-400"
            }`}>
              {isValid ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${
                isValid ? "text-green-800" : "text-yellow-800"
              }`}>
                {isValid 
                  ? "All required fields completed!" 
                  : "Please complete all required fields to proceed"
                }
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