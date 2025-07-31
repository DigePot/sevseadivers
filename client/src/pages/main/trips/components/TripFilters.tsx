import React from "react"

interface TripFiltersProps {
  destination: string
  setDestination: (v: string) => void
  destinationOptions: string[]
  activity: string
  setActivity: (v: string) => void
  activityOptions: string[]
  date: string
  setDate: (v: string) => void
}

const dropdownStyle: React.CSSProperties = {
  padding: '10px 24px',
  borderRadius: 8,
  border: '1px solid #DDD',
  fontSize: 16,
  background: '#F5F5F5',
  color: '#222',
  fontWeight: 500,
  outline: 'none',
}

export default function TripFilters({
  destination,
  setDestination,
  destinationOptions,
  activity,
  setActivity,
  activityOptions,
  date,
  setDate,
}: TripFiltersProps) {
  return (
    <>
      <style>
        {`
          @media (max-width: 768px) {
            .trip-filters-container {
              flex-wrap: wrap;
            }
            .trip-filter {
              width: 100%;
            }
            .trip-date-wrapper input {
              width: 100% !important;
            }
          }
        `}
      </style>

      <div
        className="trip-filters-container"
        style={{
          display: 'flex',
          gap: 16,
          marginBottom: 32,
          alignItems: 'center',
        }}
      >
        <select
          className="trip-filter"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          style={dropdownStyle}
        >
          {destinationOptions.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        <div
          className="trip-date-wrapper trip-filter"
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <input
            id="trip-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ ...dropdownStyle, width: 180 }}
          />
        </div>

        <select
          className="trip-filter"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          style={dropdownStyle}
        >
          {activityOptions.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </div>
    </>
  )
}
