import { createSlice } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagas/sagaConstants";

export interface LiveBookingsStats {
  activeOrders: number;
  unassigned: number;
  assigned: number;
  awaitingPickup: number;
  inTransit: number;
  completed: number;
  cancelled: number;
}

export interface LiveBookingOrder {
  bookingNumber: string;
  pickup: string;
  dropoff: string;
  customerName: string;
  riderName: string;
  vehicleType: string;
  amount: number;
  status: string;
  cancelledBy?: "rider" | "user" | string;
  cancelReason?: string;
  createdAt: string;
}

export interface LiveBookingsData {
  success: boolean;
  stats: LiveBookingsStats;
  total: number;
  page: number;
  orders: LiveBookingOrder[];
}

interface LiveBookingsState {
  data: LiveBookingsData | null;
  loading: boolean;
  error: string | null;
}

const initialState: LiveBookingsState = {
  data: null,
  loading: false,
  error: null,
};

export const liveBookingsSlice = createSlice({
  name: "liveBookings",
  initialState,
  reducers: {
    clearLiveBookings: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type === `${SagaActions.GET}_${SagaActions.ADMIN_LIVE_BOOKINGS}`,
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type ===
        `${SagaActions.GET}_${SagaActions.ADMIN_LIVE_BOOKINGS}_${SagaActionType.SUCCESS}`,
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        state.data = action.payload;
        state.loading = false;
      }
    );

    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type ===
        `${SagaActions.GET}_${SagaActions.ADMIN_LIVE_BOOKINGS}_${SagaActionType.FAIL}`,
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        state.loading = false;
        state.error = action.payload;
      }
    );
  },
});

export const { clearLiveBookings } = liveBookingsSlice.actions;
export default liveBookingsSlice.reducer;