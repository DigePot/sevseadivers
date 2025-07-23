import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import type { RootState } from "../../../store";
import { setSelectedTrip } from "../../../store/booking-slice";


const BookConfirm: React.FC = () => {
  const selectedTrip = useSelector((state: RootState) => state.booking.selectedTrip);
  const navigate = useNavigate();
  const dispatch = useDispatch();

 

  useEffect(() => {
    if (!selectedTrip) {
      const storedTrip = localStorage.getItem("selectedTrip");
      if (storedTrip) {
        dispatch(setSelectedTrip(JSON.parse(storedTrip)));
      }
    }
  }, [selectedTrip, dispatch]);


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

      {/* Trip Info Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10">
        {selectedTrip.imageUrl && (
          <div className="relative h-64 overflow-hidden">
            <img src={selectedTrip.imageUrl} alt={selectedTrip.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <h2 className="text-white text-2xl font-bold drop-shadow-lg">{selectedTrip.title}</h2>
              <div className="flex items-center mt-1 text-cyan-100 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {selectedTrip.location}
              </div>
            </div>
          </div>
        )}

        {/* Price and Description */}
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

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                📅 Date Information
              </h3>
              <div className="text-gray-700">{selectedTrip.date}</div>
            </div>

            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                📍 Location Details
              </h3>
              <div className="text-gray-700">{selectedTrip.destination}</div>
            </div>
          </div>

          {/* Terms */}
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

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <button
          onClick={() => navigate("/trips/booking-summary")}
          className="flex items-center justify-center gap-1 text-gray-600 hover:text-gray-800 font-medium px-6 py-3 rounded-lg border border-gray-300 hover:border-gray-400 transition-all"
        >
          ← Back to Summary
        </button>

        <div className="flex flex-col sm:flex-row gap-4">
      
          <button
            onClick={() => navigate("/trips/payment")}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            💳 Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookConfirm;
