import { Link } from "react-router"
import type { Trip } from "../../../../types/trip"

interface TripCardProps {
  trip: Trip
}

const cardStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 2px 8px #0001",
  padding: 24,
  gap: 32,
  transition:
    "box-shadow 0.3s cubic-bezier(.4,2,.6,1), transform 0.3s cubic-bezier(.4,2,.6,1)",
  cursor: "pointer",
}

export default function TripCard({ trip }: TripCardProps) {
  return (
    <div
      style={cardStyle}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 8px 24px #06b6d422"
        ;(e.currentTarget as HTMLDivElement).style.transform =
          "translateY(-6px) scale(1.015)"
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px #0001"
        ;(e.currentTarget as HTMLDivElement).style.transform = "none"
      }}
    >
      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
          {trip.title}
        </h2>
        <div style={{ color: "#444", margin: "12px 0 18px 0", fontSize: 16 }}>
          {trip.description}
        </div>
        <Link
          to={`/trips/${trip.id}/book`}
          style={{
            background: "#06b6d4",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 24px",
            fontWeight: 600,
            fontSize: 16,
            textDecoration: "none",
            transition: "background 0.2s",
            display: "inline-block",
          }}
        >
          Book Now
        </Link>
      </div>
      {trip.imageUrl && (
        <img
          src={trip.imageUrl}
          alt={trip.title}
          style={{
            width: 260,
            height: 140,
            objectFit: "cover",
            borderRadius: 12,
            transition: "transform 0.3s cubic-bezier(.4,2,.6,1)",
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLImageElement).style.transform =
              "scale(1.04)"
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLImageElement).style.transform = "none"
          }}
        />
      )}
    </div>
  )
}
