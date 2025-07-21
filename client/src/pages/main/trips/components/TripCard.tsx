import { useDispatch } from "react-redux"
import { setSelectedTrip } from "../../../../store/booking-slice"
import { useNavigate } from "react-router-dom"
import type { Trip } from "../../../../types/trip"

interface TripCardProps {
  trip: Trip
}

export default function TripCard({ trip }: TripCardProps) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleBookNow = () => {
    dispatch(setSelectedTrip(trip))
    navigate("/trips/booking-summary")
  }

  return (
    <div
      className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-md p-4 md:p-6 gap-6 md:gap-10 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    >
      <div className="flex-1 w-full">
        <h2 className="text-xl md:text-2xl font-bold text-cyan-700 mb-2">
          {trip.title}
        </h2>
        <div className="text-gray-700 mb-4 text-base md:text-lg">
          {trip.description}
        </div>
        <button
          onClick={handleBookNow}
          className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg px-6 py-2 font-semibold text-base md:text-lg transition-colors shadow"
        >
          Book Now
        </button>
      </div>
      {trip.imageUrl && (
        <img
          src={trip.imageUrl}
          alt={trip.title}
          className="w-full md:w-64 h-40 md:h-36 object-cover rounded-xl border shadow-sm transition-transform duration-300 hover:scale-105"
        />
      )}
    </div>
  )
}
