// slices/zoneConfigSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagas/sagaConstants";

export interface ZoneConfig {
  autoExpandOnHighDemand: boolean;
  defaultRadiusKm: number;
  overlapAllowed: boolean;
}

export interface ZoneConfigData {
  success: boolean;
  zoneConfig: ZoneConfig;
}

interface ZoneConfigState {
  data: ZoneConfigData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ZoneConfigState = {
  data: null,
  loading: false,
  error: null,
};

export const zoneConfigSlice = createSlice({
  name: "zoneConfig",
  initialState,
  reducers: {
    clearZoneConfig: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type === `${SagaActions.GET}_${SagaActions.ADMIN_ZONE_CONFIG}`,
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type ===
        `${SagaActions.GET}_${SagaActions.ADMIN_ZONE_CONFIG}_${SagaActionType.SUCCESS}`,
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      }
    );

    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type ===
        `${SagaActions.GET}_${SagaActions.ADMIN_ZONE_CONFIG}_${SagaActionType.FAIL}`,
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        state.loading = false;
        state.error = action.payload;
      }
    );
  },
});

export const { clearZoneConfig } = zoneConfigSlice.actions;
export default zoneConfigSlice.reducer;