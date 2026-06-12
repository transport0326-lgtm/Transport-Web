import { createSlice } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagas/sagaConstants";
 
// ── Types ────────────────────────────────────────────────────────────────────
 
interface PeakHour {
  start: string;
  end: string;
}
 
interface SurgePricing {
  enabled: boolean;
  surgeMultiplier: number;
  maxSurgeCap: number;
  rainSurge: number;
  peakHours: PeakHour[];
}
 
export interface ApiSurgeRule {
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  type?: string;
  trigger?: string;
  enabled?: boolean;
  isActive?: boolean;
  multiplier?: number;
  maxFareCap?: number | null;
  priority?: number;
  highDemandThresholdPct?: number;
  schedule?: {
    startTime?: string | null;
    endTime?: string | null;
    days?: string[];
  };
}

export interface Fare {
  _id: string;
  vehicleType: "bike" | "auto" | "miniTruck" | "truck";
  baseFare: number;
  baseKmIncluded: number;
  perKmRate: number;
  perMinRate: number;
  minFare: number;
  rate0to10: number | null;
  rate10to25: number | null;
  rate25plus: number | null;
  platformFee?: number;
  nightSurcharge?: number;
  weekendSurcharge?: number;
  isActive: boolean;
  surgeEnabled?: boolean;
  maxSurgeCap?: number;
  surgePricing?: SurgePricing;
  surgeRules?: ApiSurgeRule[];
  createdAt: string;
  updatedAt: string;
}
 
export interface PricingSettingsResponse {
  success: boolean;
  fares: Fare[];
}
 
interface PricingSettingsState {
  data: PricingSettingsResponse | null;
  loading: boolean;
  error: string | null;
}
 
// ── Slice ────────────────────────────────────────────────────────────────────
 
const initialState: PricingSettingsState = {
  data: null,
  loading: false,
  error: null,
};
 
const GET_BASE = `${SagaActions.GET}_${SagaActions.PRICING_SETTINGS}`;
 
export const pricingSettingsSlice = createSlice({
  name: "pricingSettings",
  initialState,
  reducers: {
    clearPricingSettings: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action): action is { type: string } => action.type === GET_BASE,
      (state) => {
        state.loading = true;
        state.error = null;
      },
    );
 
    builder.addMatcher(
      (action): action is { type: string; payload: PricingSettingsResponse } =>
        action.type === `${GET_BASE}_${SagaActionType.SUCCESS}`,
      (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      },
    );
 
    builder.addMatcher(
      (action): action is { type: string; payload: string } =>
        action.type === `${GET_BASE}_${SagaActionType.FAIL}`,
      (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
    );

    const PATCH_BASE = `${SagaActions.PATCH}_${SagaActions.ADMIN_UPDATE_PRICING}`;

builder.addMatcher(
  (action): action is { type: string } =>
    action.type === `${PATCH_BASE}_${SagaActionType.REQUEST}`,
  (state) => {
    state.loading = true;
    state.error = null;
  }
);

builder.addMatcher(
  (action): action is { type: string; payload: Fare } =>
    action.type === `${PATCH_BASE}_${SagaActionType.SUCCESS}`,
  (state, action) => {
    state.loading = false;
    if (state.data?.fares) {
      state.data.fares = state.data.fares.map((fare) =>
        fare.vehicleType === action.payload.vehicleType
          ? { ...fare, ...action.payload }
          : fare
      );
    }
  }
);

builder.addMatcher(
  (action): action is { type: string; payload: string } =>
    action.type === `${PATCH_BASE}_${SagaActionType.FAIL}`,
  (state, action) => {
    state.loading = false;
    state.error = action.payload;
  }
);
  },
});
 
export const { clearPricingSettings } = pricingSettingsSlice.actions;
export default pricingSettingsSlice.reducer;