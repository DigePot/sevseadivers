import { Link } from "react-router"

export function View404() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-lg text-center bg-white shadow-xl rounded-lg p-8 flex flex-col gap-10">
        <div>
          <h1 className="text-6xl font-bold text-[#1AB2E5]">404</h1>
          <p className="text-xl font-semibold mt-2 text-gray-700">
            Page Not Found
          </p>
          <p className="text-gray-500 mt-2">
            The page you are looking for does not exist or has been moved.
            Please check the URL or return to the homepage.
          </p>
        </div>
        <div>
          <Link
            to={"/"}
            className="cursor-pointer px-6 py-3 bg-[#1AB2E5] text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
