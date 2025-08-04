import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useGetAllStaffQuery } from "../../../store/staff";

const InstructorSchema = z.object({
  staffId: z.string().min(1, "Staff selection is required"),
  instructorName: z.string().optional(),
  instructorBio: z.string().max(500, "Bio must be under 500 characters").optional(),
  instructorRating: z
    .number({ invalid_type_error: "Must be a number" })
    .min(0)
    .max(5)
    .optional(),
  instructorImageUrl: z.string().optional(),
});

export type InstructorFormData = z.infer<typeof InstructorSchema>;

type Props = {
  initialData: InstructorFormData;
  onUpdate: (data: InstructorFormData) => void;
};

export default function CourseInstructorDetails({ initialData, onUpdate }: Props) {
  const { data: staffList } = useGetAllStaffQuery();

  const {
    register,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<InstructorFormData>({
    resolver: zodResolver(InstructorSchema),
    defaultValues: initialData,
    mode: "onChange",
  });

  const staffId = watch("staffId");
  const instructorName = watch("instructorName");
  const instructorBio = watch("instructorBio");
  const instructorRating = watch("instructorRating");
  const instructorImageUrl = watch("instructorImageUrl");

  useEffect(() => {
    if (isValid && onUpdate) {
      onUpdate({
        staffId,
        instructorName,
        instructorBio,
        instructorRating,
        instructorImageUrl,
      });
    }
  }, [staffId, instructorName, instructorBio, instructorRating, instructorImageUrl, isValid, onUpdate]);

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
      } else {
        setValue("instructorImageUrl", "", { shouldValidate: true });
      }
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-cyan-700">Instructor Details</h2>

      {/* Staff Selection */}
      {staffList && staffList.length > 0 && (
        <div>
          <label className="block font-medium mb-2 text-gray-700">Select Instructor *</label>
          <select
            {...register("staffId")}
            onChange={handleStaffSelect}
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={staffId || ""}
          >
            <option value="">Select a staff member</option>
            {staffList.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.fullName}
              </option>
            ))}
          </select>
          {errors.staffId && (
            <p className="text-red-600 text-sm mt-1">{errors.staffId.message}</p>
          )}
        </div>
      )}

      {/* Instructor Info Box - Always visible */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-4">
          {/* Image Section */}
          {staffId ? (
            instructorImageUrl ? (
              <div className="relative">
                <img
                  src={instructorImageUrl}
                  alt={`${instructorName || 'Instructor'} profile`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const fallback = document.getElementById(`staff-${staffId}-fallback`);
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div 
                  id={`staff-${staffId}-fallback`}
                  style={{ display: 'none' }}
                  className="w-16 h-16 rounded-full bg-blue-100 border-2 border-blue-200 flex items-center justify-center absolute top-0"
                >
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-100 border-2 border-blue-200 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
          
          {/* Text Section */}
          <div className="flex-1">
            {staffId ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-blue-800 font-medium">Using Staff Member Data</span>
                </div>
                <p className="text-blue-700 text-sm">
                  Instructor details are populated from the selected staff member's profile.
                </p>
              </>
            ) : (
              <p className="text-gray-600 text-sm">
                Select an instructor from the dropdown above to populate their details.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block font-medium mb-2 text-gray-700">
          Instructor Name
        </label>
        <input
          type="text"
          {...register("instructorName")}
          className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
          readOnly={!!staffId}
          value={instructorName || ""}
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block font-medium mb-2 text-gray-700">Instructor Bio</label>
        <textarea
          rows={4}
          {...register("instructorBio")}
          className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
          readOnly={!!staffId}
          value={instructorBio || ""}
        />
        {errors.instructorBio && (
          <p className="text-red-600 text-sm mt-1">{errors.instructorBio.message}</p>
        )}
      </div>

      {/* Rating */}
      <div>
        <label className="block font-medium mb-2 text-gray-700">
          Instructor Rating (0-5) *
        </label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="5"
          {...register("instructorRating", { valueAsNumber: true })}
          className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={instructorRating || ""}
        />
        {errors.instructorRating && (
          <p className="text-red-600 text-sm mt-1">{errors.instructorRating.message}</p>
        )}
      </div>
    </div>
  );
}