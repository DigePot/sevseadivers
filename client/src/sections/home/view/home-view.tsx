import { Link } from "react-router";
import heroImg from "../../../assets/hero.jpg";
import { useTrips } from "../../trip/hooks/use-trips";

export function HomeView() {
  const { allTrips } = useTrips();

  // Extract up to 3 unique destinations with their first image
  const featuredDestinations = allTrips
    ? (() => {
        const seen = new Set();
        const arr = [];
        for (const trip of allTrips) {
          if (!seen.has(trip.destination)) {
            seen.add(trip.destination);
            arr.push({
              destination: trip.destination,
              imageUrl: trip.imageUrl,
              description: trip.description,
            });
            if (arr.length === 3) break;
          }
        }
        return arr;
      })()
    : [];

  return (
    <>
      <section className="relative w-full h-screen bg-gray-900 text-white">
        <div
          className="relative w-full overflow-hidden shadow-lg"
          style={{
            backgroundImage: `url(${heroImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center items-center text-center px-6 py-16 md:py-28 min-h-screen">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg leading-tight">
              Explore the Depths with <br className="hidden md:block" />
              <span className="block md:inline text-cyan-400">SEVSEA DIVERS</span>
            </h1>

            <p className="mt-6 text-base md:text-lg lg:text-xl text-white drop-shadow-md max-w-2xl">
              Discover the beauty of the underwater world with our expert-led diving and snorkeling trips.
              Whether you're a beginner or an experienced diver, we have the perfect adventure for you.
            </p>

            <Link
              to="/trips"
              className="mt-8 inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-8 py-3 rounded-lg text-lg shadow-lg transition-all duration-300"
            >
              Book Your Adventure
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{ color: '#06b6d4', textAlign: 'center' }}>Featured Destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredDestinations.map((dest) => (
            <div
              key={dest.destination}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col transition-shadow duration-300 group hover:shadow-xl hover:-translate-y-1"
              style={{ cursor: 'pointer' }}
            >
              {dest.imageUrl && (
                <img
                  src={dest.imageUrl}
                  alt={dest.destination}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-cyan-700 mb-2">{dest.destination}</h3>
                <p className="text-gray-600 text-sm flex-1 mb-4">{dest.description}</p>
                <a
                  href={`/trips?destination=${encodeURIComponent(dest.destination)}`}
                  className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-6 py-2 rounded-lg text-base shadow transition-all duration-200 mt-auto group-hover:scale-105"
                  style={{ textAlign: 'center' }}
                >
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
