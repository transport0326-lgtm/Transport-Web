import { createSlice } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagas/sagaConstants";

export interface Zone {
  _id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  isActive: boolean;
  areaCoverage: number | null;
  maxActiveRiders: number | null;
  minOrderValue: number | null;
  baseDeliveryFee: number | null;
  perKmRate: number | null;
  description: string | null;
  activeRiders: number;
  totalRiders: number;
  createdAt: string;
  updatedAt: string;
}

export interface ZoneSettingsData {
  success: boolean;
  total: number;
  page: number;
  zones: Zone[];
}

interface ZoneSettingsState {
  data: ZoneSettingsData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ZoneSettingsState = {
  data: null,
  loading: false,
  error: null,
};

export const zoneSettingsSlice = createSlice({
  name: "zoneSettings",
  initialState,
  reducers: {
    clearZoneSettings: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type === `${SagaActions.GET}_${SagaActions.ZONE_SETTINGS}`,
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      (action: any) => 
        action.type ===
        `${SagaActions.GET}_${SagaActions.ZONE_SETTINGS}_${SagaActionType.SUCCESS}`,
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        state.data = action.payload;
        state.loading = false;
      }
    );

    builder.addMatcher(
      (action: any) =>
        action.type ===
        `${SagaActions.GET}_${SagaActions.ZONE_SETTINGS}_${SagaActionType.FAIL}`,
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        state.loading = false;
        state.error = action.payload;
      }
    );
  },
});

export const { clearZoneSettings } = zoneSettingsSlice.actions;
export default zoneSettingsSlice.reducer;