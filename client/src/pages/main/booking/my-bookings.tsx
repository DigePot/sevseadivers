import { useState, useEffect } from "react";
import { useGetAllBookingQuery, useCancelBookingMutation } from "../../../store/booking";
import type { Booking } from "../../../types/booking";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Sidebar from "./sidebar";



const MyBookingsPage = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { data, isLoading, error, refetch } = useGetAllBookingQuery();
  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  // Handle escape key for modal closing
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };
    
    if (showCancelModal) {
      document.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [showCancelModal]);

  // Simplified bookings extraction
  const bookings: Booking[] = (() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data && Array.isArray((data as any).data)) return (data as any).data;
    return [];
  })();

  const handleCancelClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const confirmCancellation = async () => {
    if (selectedBooking) {
      try {
        await cancelBooking(selectedBooking.id).unwrap();
        refetch();
      } catch (err) {
        console.error("Failed to cancel booking:", err);
      } finally {
        setShowCancelModal(false);
        setSelectedBooking(null);
      }
    }
  };

  const closeModal = () => {
    setShowCancelModal(false);
    setSelectedBooking(null);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "completed":
        return { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" };
      case "pending":
        return { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" };
      case "cancelled":
        return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300" };
      case "upcoming":
        return { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300" };
    }
  };

  const BookingSkeleton = () => (
    <div className="bg-white rounded-xl shadow p-5 flex flex-col h-full animate-pulse">
      <div className="bg-gray-200 rounded-lg w-full h-40 mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-8 bg-gray-200 rounded w-1/3 mt-auto mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        isExpanded={isExpanded} 
        toggleSidebar={toggleSidebar} 
      />

      <main className={`flex-1 p-4 sm:p-6 md:p-8 transition-all duration-300 ease-in-out ${
        isExpanded ? "lg:ml-10" : "ml-0"
      }`}>
        <div className="flex items-center mb-6 flex-wrap gap-2">
          <button
            onClick={toggleSidebar}
            className="mr-4 p-2 rounded-md hover:bg-gray-200 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-cyan-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyan-700">My Bookings</h1>
        </div>
        
        {isLoading && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <BookingSkeleton key={index} />
            ))}
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-2xl mx-auto text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-red-700 mb-2">Error loading bookings</h3>
            <p className="text-gray-600 mb-4">
              {error && 'status' in error 
                ? `Error ${error.status}: ${JSON.stringify(error.data)}`
                : "We encountered an issue while loading your bookings"}
            </p>
            <button 
              onClick={() => refetch()}
              className="px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-800 transition-colors"
            >
              Retry
            </button>
          </div>
        )}
        
        {!isLoading && !error && bookings.length === 0 && (
          <div className="max-w-lg mx-auto text-center py-12">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto mb-6 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Bookings Yet</h3>
            <p className="text-gray-600 mb-6">You haven't made any bookings yet. Start exploring our trips and courses!</p>
            <button 
              onClick={() => navigate("/trips")}
              className="px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-800 transition-colors"
            >
              Explore Trips
            </button>
          </div>
        )}
        
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking: Booking) => {
            const statusStyle = getStatusStyle(booking.status);
            const title = booking.Trip?.title || booking.Course?.title || "Booking";
            const description = booking.Trip?.description || booking.Course?.description || "";
            const imageUrl = booking.Trip?.imageUrl || booking.Course?.imageUrl;
            const bookingDate = booking.bookingDate ? format(new Date(booking.bookingDate), "MMM d, yyyy") : "N/A";
            const price = booking.amount ?? booking.Trip?.price ?? booking.Course?.price ?? "-";
            
            return (
              <div 
                key={booking.id} 
                className="bg-white rounded-xl shadow p-5 flex flex-col h-full transition-transform hover:translate-y-[-4px] hover:shadow-lg"
              >
                {imageUrl ? (
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-full h-40 object-cover rounded-lg mb-4 border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/300?text=Image+Not+Available";
                      }}
                    />
                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                ) : (
                  <div className="relative bg-gray-200 border-2 border-dashed rounded-lg w-full h-40 mb-4 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                )}
                
                <h2 className="text-lg sm:text-xl font-semibold mb-2 text-cyan-700 line-clamp-1">{title}</h2>
                
                <p className="text-gray-600 mb-3 flex-grow line-clamp-3">
                  {description || "No description available"}
                </p>
                
                <div className="flex justify-between items-center mb-3">
                  <div className="text-cyan-700 font-bold">${price}</div>
                  <div className="text-sm text-gray-500">
                    {bookingDate}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-auto">
                  <div className="text-xs text-gray-400">
                    Booked on: {bookingDate}
                  </div>
                  <div className="flex gap-2 items-center">
                    {booking.status === "completed" && (
                      <button
                        onClick={() => navigate('/need-help')}
                        className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors flex items-center"
                        aria-label={`Need help with booking for ${title}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 14h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Need Help?
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Cancellation Confirmation Modal */}
      {showCancelModal && selectedBooking && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-cyan-700">Cancel Booking</h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="mb-4 text-gray-600">
              Are you sure you want to cancel your booking for <span className="font-semibold">{selectedBooking.Trip?.title || selectedBooking.Course?.title || "this item"}</span>?
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isCancelling}
              >
                Go Back
              </button>
              <button
                onClick={confirmCancellation}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                disabled={isCancelling}
              >
                {isCancelling && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;