import { useForm, Controller, useWatch } from "react-hook-form";
import { z as zod } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef, useEffect } from "react";

// Updated Zod schema with optional video and no size limit
const CurriculumSchema = zod.object({
  videoFile: zod
    .instanceof(File, { message: "Please upload a valid video file" })
    .nullable()
    .optional()
    .refine(
      (file) => file === null || file === undefined || ["video/mp4", "video/webm", "video/ogg"].includes(file.type),
      { message: "Only MP4, WebM, and Ogg formats are supported" }
    ),
  learnPoints: zod
    .array(zod.string().min(1, "Cannot be empty"))
    .min(1, "Add at least one learning point"),
  includes: zod
    .array(
      zod.object({
        icon: zod.string().min(1, "Icon is required"),
        text: zod.string().min(1, "Text is required"),
      })
    )
    .min(1, "Add at least one include"),
});

export type CurriculumFormValues = zod.infer<typeof CurriculumSchema>;

type Props = {
  initialData: CurriculumFormValues;
  onUpdate: (data: CurriculumFormValues) => void;
};

export function CourseCurriculumForm({ initialData, onUpdate }: Props) {
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<CurriculumFormValues>({
    resolver: zodResolver(CurriculumSchema),
    defaultValues: {
      ...initialData,
      videoFile: initialData.videoFile || null,
      includes: initialData.includes || [{ icon: '', text: '' }],
    },
    mode: "onChange",
  });

  const formValues = useWatch({ control });
  const watchVideoFile = watch("videoFile");

  // Update parent when form changes
  useEffect(() => {
    if (onUpdate) {
      onUpdate({
        videoFile: formValues.videoFile ?? null,
        learnPoints: formValues.learnPoints ?? [""],
        includes: (formValues.includes ?? [{ icon: '', text: '' }]).map(i => ({
          icon: i.icon ?? '',
          text: i.text ?? ''
        })),
      });
    }
  }, [formValues]);

  // Handle video preview
  useEffect(() => {
    if (watchVideoFile instanceof File) {
      const url = URL.createObjectURL(watchVideoFile);
      setVideoPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setVideoPreview(null);
    }
  }, [watchVideoFile]);

  // Form actions (unchanged from your original)
  const addInclude = () => {
    const currentIncludes = watch("includes");
    setValue("includes", [...currentIncludes, { icon: '', text: '' }]);
  };

  const removeInclude = (index: number) => {
    const currentIncludes = watch("includes");
    if (currentIncludes.length > 1) {
      setValue("includes", currentIncludes.filter((_, i) => i !== index));
    }
  };

  const handleClickUpload = () => fileInputRef.current?.click();

  const handleRemoveVideo = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
    }
    setValue("videoFile", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const addLearnPoint = () => {
    const currentPoints = watch("learnPoints");
    setValue("learnPoints", [...currentPoints, ""]);
  };

  const removeLearnPoint = (index: number) => {
    const currentPoints = watch("learnPoints");
    if (currentPoints.length > 1) {
      setValue("learnPoints", currentPoints.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-cyan-700 mb-6">
        Course Curriculum
      </h1>

      <div className="space-y-8">
        {/* Updated Video Upload Section */}
        <div>
          <label className="block font-medium mb-3 text-gray-700">
            Upload Overview Video (Optional)
          </label>
          <Controller
            name="videoFile"
            control={control}
            render={({ field }) => (
              <div className="space-y-4">
                {videoPreview ? (
                  <div className="relative rounded-xl overflow-hidden border bg-black border-gray-200">
                    <video
                      ref={videoRef}
                      src={videoPreview}
                      className="w-full max-h-[400px] object-contain"
                      onClick={togglePlay}
                    />
                    <div className="absolute bottom-4 left-4 bg-black/50 rounded-full p-2">
                      <button type="button" onClick={togglePlay} className="text-white">
                        {isPlaying ? "⏸️" : "▶️"}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveVideo}
                      className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      🗑️
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={handleClickUpload}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-blue-400 cursor-pointer bg-gray-50"
                  >
                    <div className="flex flex-col items-center">
                      <div className="bg-blue-100 rounded-full p-4 mb-4">
                        📁
                      </div>
                      <p className="text-gray-600 font-medium">
                        <span className="text-blue-600">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-sm text-gray-500 mt-2">MP4, WebM, Ogg (Optional)</p>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/ogg"
                  ref={(e) => {
                    fileInputRef.current = e;
                    field.ref(e);
                  }}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    field.onChange(file);
                  }}
                  className="hidden"
                />
              </div>
            )}
          />
          {errors.videoFile && (
            <p className="text-red-600 text-sm mt-2">{errors.videoFile.message}</p>
          )}
        </div>

        {/* Learn Points */}
        <div>
          <label className="block font-medium mb-3 text-gray-700">What You Will Learn *</label>
          <div className="space-y-3">
            {watch("learnPoints").map((_, index) => (
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
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addLearnPoint}
            className="flex items-center mt-3 text-blue-600 font-medium hover:text-blue-800"
          >
            ➕ Add another learning point
          </button>
          {errors.learnPoints && (
            <p className="text-red-600 text-sm mt-2">{errors.learnPoints.message as string}</p>
          )}
        </div>

        {/* Includes Section */}
        <div>
          <label className="block font-medium mb-3 text-gray-700">This course includes:</label>
          <div className="space-y-4">
            {watch("includes").map((_, index) => (
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
                      className="text-red-500 hover:text-red-700 p-2"
                      title="Remove"
                    >
                      ❌
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
            className="flex items-center mt-4 text-blue-600 font-medium hover:text-blue-800"
          >
            ➕ Add another include
          </button>

          {errors.includes && typeof errors.includes?.message === "string" && (
            <p className="text-red-600 text-sm mt-2">{errors.includes.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}