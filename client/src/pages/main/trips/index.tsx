import { Helmet } from "react-helmet-async"
import { CONFIG } from "../../../global-config"
import { useTrips } from "../../../sections/trip/hooks/use-trips"
import React, { useState, useMemo } from "react"
import TripFilters from "./components/TripFilters"
import TripCard from "./components/TripCard"
import TripPagination from "./components/TripPagination"

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
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 32 }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 32 }}>
          Explore Our Diving and Snorkeling Trips
        </h1>
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
        {isLoading && <div>Loading trips...</div>}
        {error && <div style={{ color: "red" }}>Failed to load trips.</div>}
        {!isLoading && !error && paginatedTrips.length === 0 && (
          <div style={{ color: "#888", fontSize: 18 }}>No trips available.</div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {paginatedTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
        <TripPagination page={page} setPage={setPage} totalPages={totalPages} />
      </div>
    </>
  )
}
