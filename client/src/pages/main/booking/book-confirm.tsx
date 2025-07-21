import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../../store";

const BookConfirm: React.FC = () => {
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
        <h1 className="text-3xl font-bold text-cyan-800">Confirm Your Booking</h1>
        <p className="text-cyan-600 mt-2">Review your trip details before payment</p>
        <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-teal-500 mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10">
        {selectedTrip.imageUrl && (
          <div className="relative h-64 overflow-hidden">
            <img
              src={selectedTrip.imageUrl}
              alt={selectedTrip.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <h2 className="text-white text-2xl font-bold drop-shadow-lg">
                {selectedTrip.title}
              </h2>
              <div className="flex items-center mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-300 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-cyan-100 font-medium">{selectedTrip.location}</span>
              </div>
            </div>
          </div>
        )}

        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Trip Details</h3>
              <p className="text-gray-600 max-w-lg">{selectedTrip.description}</p>
            </div>
            <div className="bg-cyan-50 px-4 py-3 rounded-lg text-center min-w-[120px]">
              <div className="text-cyan-600 text-sm font-medium">Total Price</div>
              <div className="text-2xl font-bold text-cyan-700">${selectedTrip.price}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Date Information
              </h3>
              <div className="flex items-center text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {selectedTrip.date}
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Location Details
              </h3>
              <div className="flex items-center text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {selectedTrip.destination}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-700 mb-4">Booking Terms</h3>
            <div className="text-sm text-gray-600 bg-cyan-50 p-4 rounded-lg mb-6">
              <ul className="list-disc pl-5 space-y-2">
                <li>Full payment required to confirm booking</li>
                <li>Cancellations within 7 days receive 50% refund</li>
                <li>Date changes subject to availability</li>
                <li>Prices include all taxes and fees</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-1 text-gray-600 hover:text-gray-800 font-medium px-6 py-3 rounded-lg border border-gray-300 hover:border-gray-400 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Summary
        </button>
        
        <button
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
          onClick={() => navigate("/trips/payment")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default BookConfirm;