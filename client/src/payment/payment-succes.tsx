import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccessPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate(); // ✅ useNavigate hook

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Successful!</h2>
        <p className="mb-4 text-gray-600">
          Thank you for purchasing <span className="font-semibold">{state?.courseTitle || "the course"}</span>
        </p>
        <p className="mb-6 text-cyan-700 font-medium">
          Amount: ${state?.amount || "0.00"}
        </p>
        <div className="flex flex-col gap-3">
          <button
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition"
            onClick={() => navigate("/mycourses")} // ✅ Correct
          >
            Go to My Courses
          </button>
          <button
            className="border border-cyan-600 text-cyan-700 px-6 py-3 rounded-lg font-medium transition hover:bg-cyan-50"
            onClick={() => navigate("/courses")} // ✅ Correct
          >
            Browse More Courses
          </button>
        </div>
        {state?.paymentId && (
          <p className="mt-6 text-sm text-gray-500">
            Payment ID: {state.paymentId}
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
