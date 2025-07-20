import Spinner from "../../../../components/Spinner"
import { useAllGallery } from "../hooks"

export function GalleryView() {
  const { allGallery, isLoading, error, refetch } = useAllGallery()

  // Handle loading state
  if (isLoading) {
    return <Spinner />
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-lg font-semibold text-red-600">
          Failed to load gallery. Please try again later.
        </div>
        <button
          onClick={() => refetch()}
          className="mt-4 py-2 px-4 bg-cyan-600 text-white rounded-md shadow-md hover:bg-cyan-700 focus:outline-none"
        >
          Retry
        </button>
      </div>
    )
  }

  // Handle empty gallery case
  if (allGallery.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-lg font-semibold text-gray-700">
          No gallery items found.
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-sky-200 via-gray-400 to-gray-700 dark:from-slate-800 dark:to-slate-900 transition-all">
      <h1 className="text-3xl font-bold text-center text-white mb-8">
        Gallery
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allGallery.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative">
              {/* Image or Media */}
              {item.mediaType === "image" ? (
                <img
                  src={item.mediaUrl}
                  alt={item.title}
                  className="w-full h-56 object-cover"
                />
              ) : (
                <video
                  src={item.mediaUrl}
                  controls
                  className="w-full h-56 object-cover"
                />
              )}

              <div className="absolute top-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-bl-lg">
                {item.isActive ? "Active" : "Inactive"}
              </div>
            </div>

            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {item.title}
              </h2>
              <p className="text-sm text-gray-600 mt-2">{item.description}</p>
              <div className="flex justify-between items-center mt-4">
                {/* <span className="text-sm text-gray-500">
                  Uploaded by {item.uploader.fullName}
                </span> */}
                <span className="text-sm text-gray-500">Uploaded</span>
                <span className="text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
