import { Helmet } from "react-helmet-async"
import { CONFIG } from "../../../global-config"
import { useTrips } from "../../../sections/trip/hooks/use-trips"
import React, { useState, useMemo } from "react"
import TripFilters from "./components/TripFilters"
import TripCard from "./components/TripCard"
import TripPagination from "./components/TripPagination"
import Spinner from "../../../components/Spinner"

import { TripsHeader } from "./components/trip-header"

const metadata = { title: `Trips | ${CONFIG.appName}` }

export default function Page() {
  const { allTrips, isLoading, error } = useTrips()

  // Dynamic filter options
  const destinationOptions = useMemo(() => {
    if (!allTrips) return ["All Destinations"]
    const unique = Array.from(
      new Set(allTrips.map((t) => t.destination))
    ).sort()
    return ["All Destinations", ...unique]
  }, [allTrips])

  const activityOptions = useMemo(() => {
    if (!allTrips) return ["All Activities"]
    const unique = Array.from(
      new Set(allTrips.map((t) => t.activityType))
    ).sort()
    return ["All Activities", ...unique]
  }, [allTrips])

  // Filter state
  const [destination, setDestination] = useState("All Destinations")
  const [activity, setActivity] = useState("All Activities")
  const [date, setDate] = useState("")
  
  // Pagination
  const [page, setPage] = useState(1)
  const tripsPerPage = 4

  // Filtering logic
  const filteredTrips = useMemo(() => {
    if (!allTrips) return []
    return allTrips.filter((trip) => {
      const matchDestination =
        destination === "All Destinations" || trip.destination === destination
      const matchActivity =
        activity === "All Activities" || trip.activityType === activity
      const matchDate = !date || trip.date === date
      return matchDestination && matchActivity && matchDate
    })
  }, [allTrips, destination, activity, date])

  const totalPages = Math.max(1, Math.ceil(filteredTrips.length / tripsPerPage))
  const paginatedTrips = filteredTrips.slice(
    (page - 1) * tripsPerPage,
    page * tripsPerPage
  )

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setPage(1)
  }, [destination, activity, date])

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      
      <div className="pb-12">
        <TripsHeader />
        
        <div className="container mx-auto px-4 sm:px-6">
          <TripFilters
            destination={destination}
            setDestination={setDestination}
            destinationOptions={destinationOptions}
            activity={activity}
            setActivity={setActivity}
            activityOptions={activityOptions}
            date={date}
            setDate={setDate}
          />
          
          {isLoading && <Spinner  />}
          
          {error && (
            <div className="text-red-600 text-center my-8">
              Failed to load trips. Please try again later.
            </div>
          )}
          
          {!isLoading && !error && paginatedTrips.length === 0 && (
            <div className="text-gray-500 text-lg text-center my-12">
              No trips match your filters.
            </div>
          )}
          
          {/* Reverted to original card display style */}
          <div className="flex flex-col gap-8">
            {paginatedTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
          
          <TripPagination 
            page={page} 
            setPage={setPage} 
            totalPages={totalPages} 
          />
        </div>
        
       
      </div>
    </>
  )
}