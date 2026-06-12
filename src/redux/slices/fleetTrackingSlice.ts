import { createSlice } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagas/sagaConstants";

export interface RiderSummary {
  total: number;
  onDelivery: number;
  idle: number;
  offline: number;
}

export interface Rider {
  _id: string;
  name: string;
  initials: string;
  vehicleNumber: string;
  vehicleType: string | null;
  zoneId?: string | null;
  isActive?: boolean;
  location: null;
  status: "idle" | "offline" | "onDelivery";
  activeBooking: null;
}

export interface FleetData {
  success: boolean;
  summary: RiderSummary;
  riders: Rider[];
}

interface FleetState {
  data: FleetData | null;
  loading: boolean;
  error: string | null;
}

const initialState: FleetState = {
  data: null,
  loading: false,
  error: null,
};

export const fleetSlice = createSlice({
  name: "fleet",
  initialState,
  reducers: {
    clearFleet: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type === `${SagaActions.GET}_${SagaActions.ADMIN_FLEET}`,
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type ===
        `${SagaActions.GET}_${SagaActions.ADMIN_FLEET}_${SagaActionType.SUCCESS}`,
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      }
    );

    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type ===
        `${SagaActions.GET}_${SagaActions.ADMIN_FLEET}_${SagaActionType.FAIL}`,
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        state.loading = false;
        state.error = action.payload;
      }
    );
  },
});

export const { clearFleet } = fleetSlice.actions;
export default fleetSlice.reducer;