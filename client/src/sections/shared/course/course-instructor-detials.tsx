import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";

// Zod Schema - Updated to handle null initially
const InstructorSchema = z.object({
  instructorName: z.string().min(1, "Name is required"),
  instructorImage: z
    .instanceof(File)
    .nullable()
    .refine((file) => file !== null && file.size > 0, "Image is required")
    .refine(
      (file) => file === null || ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only JPG, PNG, or WEBP allowed"
    )
    .refine((file) => file === null || file.size < 5 * 1024 * 1024, "Max size 5MB"),
  instructorBio: z
    .string()
    .min(1, "Bio is required")
    .max(500, "Bio must be under 500 characters"),
  instructorRating: z
    .number({ invalid_type_error: "Must be a number" })
    .min(0)
    .max(5),
});

export type InstructorFormValues = z.infer<typeof InstructorSchema>;

type Props = {
  initialData: InstructorFormValues;
  onUpdate: (data: InstructorFormValues) => void;
};

export default function CourseInstructorDetails({ initialData, onUpdate }: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    watch, 
    setValue,
    formState: { errors, isValid },
    control,
  } = useForm<InstructorFormValues>({
    resolver: zodResolver(InstructorSchema),
    defaultValues: initialData,
    mode: "onChange",
  });

  // Watch all form values using useWatch to avoid infinite loop
  const formValues = useWatch({
    control,
    defaultValue: {
      instructorName: initialData.instructorName || "",
      instructorImage: initialData.instructorImage ?? null,
      instructorBio: initialData.instructorBio || "",
      instructorRating: initialData.instructorRating ?? 0,
    },
  });
  
  // Update parent when form changes and is valid
  useEffect(() => {
    if (isValid && onUpdate) {
      onUpdate({
        instructorName: formValues.instructorName ?? "",
        instructorImage: formValues.instructorImage ?? null,
        instructorBio: formValues.instructorBio ?? "",
        instructorRating: formValues.instructorRating ?? 0,
      });
    }
  }, [formValues, isValid]); // Removed onUpdate from dependencies since it's now memoized

  const imageFile = watch("instructorImage");

  // Update preview when image changes
  useEffect(() => {
    if (imageFile instanceof File) {
      const url = URL.createObjectURL(imageFile);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [imageFile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("instructorImage", file);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-cyan-700">Instructor Details</h2>

      <div className="space-y-6">
        {/* Name */}
        <div>
          <label className="block font-medium mb-2 text-gray-700">Instructor Name *</label>
          <input
            type="text"
            {...register("instructorName")}
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {errors.instructorName && (
            <p className="text-red-600 text-sm mt-1">{errors.instructorName.message}</p>
          )}
        </div>

        {/* Bio */}
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

        {/* Image Upload with Circular Preview */}
        <div>
          <label className="block font-medium mb-2 text-gray-700">Instructor Image *</label>

          <div
            onClick={() => document.getElementById("instructor-image-input")?.click()}
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-xl cursor-pointer hover:border-blue-400 transition"
          >
            {preview ? (
              <img
                src={preview}
                alt="Instructor Preview"
                className="w-32 h-32 object-cover rounded-full border"
              />
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
            id="instructor-image-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="hidden"
          />

          {errors.instructorImage && (
            <p className="text-red-600 text-sm mt-1">{errors.instructorImage.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}