import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface BookingState {
  selectedTrip: any | null; // Replace 'any' with your Trip type if available
  bookingDetails: any | null; // Replace 'any' with your Booking details type if available
}

const initialState: BookingState = {
  selectedTrip: null,
  bookingDetails: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setSelectedTrip(state, action: PayloadAction<any>) {
      state.selectedTrip = action.payload;
    },
    setBookingDetails(state, action: PayloadAction<any>) {
      state.bookingDetails = action.payload;
    },
    clearBooking(state) {
      state.selectedTrip = null;
      state.bookingDetails = null;
    },
  },
});

export const { setSelectedTrip, setBookingDetails, clearBooking } = bookingSlice.actions;
export default bookingSlice.reducer; 