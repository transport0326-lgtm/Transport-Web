import { createSlice } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagas/sagaConstants";

export interface LiveActivityItem {
  bookingNumber: string;
  status: string;
  updatedAt: string;
}

export interface RecentOrder {
  bookingNumber: string;
  pickup: string;
  dropoff: string;
  riderId: string | null;
  vehicleType: string;
  amount: number;
  status: string;
  cancelledBy?: "rider" | "user" | string;
  createdAt: string;
}

export interface DashboardData {
  success: boolean;
  activeRiders: number;
  todayOrders: number;
  todayRevenue: number;
  avgDeliveryMin: number;
  deliveriesThisWeek: number[];
  liveActivity: LiveActivityItem[];
  recentOrders: RecentOrder[];
}

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboard: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type === `${SagaActions.GET}_${SagaActions.ADMIN_DASHBOARD}`,
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type ===
        `${SagaActions.GET}_${SagaActions.ADMIN_DASHBOARD}_${SagaActionType.SUCCESS}`,
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        state.data = action.payload;
        state.loading = false;
      }
    );

    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type ===
        `${SagaActions.GET}_${SagaActions.ADMIN_DASHBOARD}_${SagaActionType.FAIL}`,
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        state.loading = false;
        state.error = action.payload;
      }
    );
  },
});

export const { clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
