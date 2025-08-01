import { useDispatch } from "react-redux";
import { setSelectedTrip } from "../../../../store/booking-slice";
import { useNavigate } from "react-router";
import type { Trip } from "../../../../types/trip";

interface TripCardProps {
  trip: Trip;
}

export default function TripCard({ trip }: TripCardProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleBookNow = () => {
    dispatch(setSelectedTrip(trip));
    navigate("/trips/booking-summary");
  };

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 cursor-pointer border-1 border-cyan-50 hover:border-blue-600">
      {/* Content Section (Left) */}
      <div className="flex-1 p-6 md:p-8 flex flex-col order-2 md:order-1">
        <div className="flex-grow">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {trip.title}
          </h2>
          <p className="text-gray-600 mb-5 line-clamp-3">
            {trip.description}
          </p>
        </div>

        {/* Meta Information */}
        <div className="flex flex-wrap gap-3 mb-6">
          {trip.destination && (
            <div className="flex items-center gap-2 bg-cyan-50/70 px-4 py-2 rounded-full border border-cyan-100 hover:border-blue-200 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-cyan-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                {trip.destination}
              </span>
            </div>
          )}
          {trip.duration && (
            <div className="flex items-center gap-2 bg-yellow-50/70 px-4 py-2 rounded-full border border-yellow-100 hover:border-blue-200 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                {trip.duration}
              </span>
            </div>
          )}
        </div>

        {/* Footer with Price and CTA (Left) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={handleBookNow}
            className="bg-cyan-600 hover:bg-blue-600 text-white rounded-lg px-6 py-3 font-semibold transition-colors shadow-md hover:shadow-lg whitespace-nowrap order-1"
          >
            Book Now
          </button>
          <div className="flex items-center order-2 sm:order-3">
            <span className="text-lg font-bold text-cyan-700">
              ${trip.price}
            </span>
          </div>
        </div>
      </div>

      {/* Image Section (Right) - Fixed Size */}
      {trip.imageUrl && (
        <div className="relative w-full md:w-96 h-64 overflow-hidden order-1 md:order-2">
          <img
            src={trip.imageUrl}
            alt={trip.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />

        </div>
      )}
    </div>
  );
}