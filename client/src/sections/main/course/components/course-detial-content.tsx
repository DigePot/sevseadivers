// components/CourseContentSection.tsx
import VideoPlayer from "./video-player";
import { useGetCourseQuery } from "../../../../store/course";
import { useParams } from "react-router";

export default function CourseContentSection() {
  const { id } = useParams();
  const { data: course, isLoading } = useGetCourseQuery(id as string);

  if (isLoading) return <div>Loading...</div>;
  if (!course) return <div>Course not found.</div>;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-cyan-700">Course Overview</h2>

      <VideoPlayer
        videoUrl={course.videoUrl}
        posterUrl={course.posterUrl || "https://via.placeholder.com/800x450?text=Course+Preview"}
        className="rounded-lg"
      />
    </div>
  );
}
