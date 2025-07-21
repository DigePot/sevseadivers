import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../../store";

const BookingSummary: React.FC = () => {
  const selectedTrip = useSelector((state: RootState) => state.booking.selectedTrip);
  const navigate = useNavigate();

  if (!selectedTrip) {
    return (
      <div className="max-w-md mx-auto p-8 mt-16 text-center bg-white rounded-xl shadow-lg">
        <div className="text-red-500 text-xl font-medium mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          No trip selected
        </div>
        <p className="text-gray-600 mb-6">Please go back and choose a trip to book</p>
        <button 
          onClick={() => navigate(-1)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-6 py-2 rounded-lg transition-all shadow-md hover:shadow-lg"
        >
          Back to Trips
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-gradient-to-br from-white to-cyan-50 rounded-2xl shadow-xl overflow-hidden p-8 my-10 border border-cyan-100">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-cyan-800">Booking Summary</h1>
        <div className="w-20 h-1 bg-cyan-500 mx-auto mt-3 rounded-full"></div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {selectedTrip.imageUrl && (
          <div className="relative h-64 overflow-hidden">
            <img
              src={selectedTrip.imageUrl}
              alt={selectedTrip.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <h2 className="absolute bottom-4 left-4 text-white text-2xl font-bold drop-shadow-lg">
              {selectedTrip.title}
            </h2>
          </div>
        )}

        <div className="p-6">
          <p className="text-gray-600 mb-6 italic">{selectedTrip.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-cyan-50 p-4 rounded-lg text-center">
              <div className="text-cyan-600 font-semibold mb-1 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Location
              </div>
              <p className="text-gray-800 font-medium">{selectedTrip.destination}</p>
            </div>
            
            <div className="bg-cyan-50 p-4 rounded-lg text-center">
              <div className="text-cyan-600 font-semibold mb-1 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Date
              </div>
              <p className="text-gray-800 font-medium">{selectedTrip.date}</p>
            </div>
            
            <div className="bg-cyan-50 p-4 rounded-lg text-center">
              <div className="text-cyan-600 font-semibold mb-1 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Price
              </div>
              <p className="text-gray-800 font-medium">${selectedTrip.price}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-1 text-gray-600 hover:text-gray-800 font-medium px-6 py-3 rounded-lg border border-gray-300 hover:border-gray-400 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            
            <button
              className="flex items-center justify-center gap-1 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              onClick={() => navigate("/trips/book-confirm")}
            >
              Confirm Booking
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;