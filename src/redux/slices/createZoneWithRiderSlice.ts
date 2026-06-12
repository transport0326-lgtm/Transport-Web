import { createSlice } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagas/sagaConstants";

export interface ZoneData {
  _id: string;
  name: string;
  city: string;
  state: string;
  areaCoverage: number;
  maxActiveRiders: number;
  minOrderValue: number;
  baseDeliveryFee: number;
  perKmRate: number;
  description: string;
  isActive: boolean;
  createdAt: string;
}

interface CreateZoneState {
  data: ZoneData | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: CreateZoneState = {
  data: null,
  loading: false,
  error: null,
  success: false,
};

export const createZoneSlice = createSlice({
  name: "createZone",
  initialState,
  reducers: {
    clearCreateZone: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type === `${SagaActions.POST}_${SagaActions.ADMIN_CREATE_ZONE}`,
      (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      }
    );

    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type ===
        `${SagaActions.POST}_${SagaActions.ADMIN_CREATE_ZONE}_${SagaActionType.SUCCESS}`,
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        state.data = action.payload;
        state.loading = false;
        state.success = true;
      }
    );

    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type ===
        `${SagaActions.POST}_${SagaActions.ADMIN_CREATE_ZONE}_${SagaActionType.FAIL}`,
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      }
    );
  },
});

export const { clearCreateZone } = createZoneSlice.actions;
export default createZoneSlice.reducer;