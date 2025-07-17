import { useParams, useNavigate } from "react-router-dom";
import { useGetCourseQuery } from "../../../../store/course";
import { useAuth } from "../../../../sections/auth/hooks/use-auth";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: course, isLoading } = useGetCourseQuery(id);
  const { user } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!course) return <div>Course not found.</div>;

  const handleEnroll = () => {
    if (!user) {
      // Redirect to sign in, then back to enroll
      navigate(`/auth/sign-in?redirect=/courses/${id}/enroll`);
    } else {
      navigate(`/courses/${id}/enroll`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <img src={course.imageUrl} alt={course.title} className="w-full rounded-xl mb-6" />
      <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
      <p className="text-gray-700 mb-4">{course.description}</p>
      <div className="mb-4">
        <span className="font-semibold">Price:</span> {course.price} €
      </div>
      <button
        onClick={handleEnroll}
        className="bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold"
      >
        Enroll
      </button>
    </div>
  );
}