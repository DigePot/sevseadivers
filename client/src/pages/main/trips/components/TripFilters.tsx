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

export default function TripFilters({
  destination, setDestination, destinationOptions,
  activity, setActivity, activityOptions,
  date, setDate
}: TripFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-8 p-4 bg-white/90 rounded-lg shadow-sm">
      <select 
        value={destination} 
        onChange={e => setDestination(e.target.value)}
        className="flex-grow p-3 rounded-lg border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      >
        {destinationOptions.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      
      <select 
        value={activity} 
        onChange={e => setActivity(e.target.value)}
        className="flex-grow p-3 rounded-lg border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      >
        {activityOptions.map(a => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>
      
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        className="p-3 rounded-lg border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
    </div>
  )
}