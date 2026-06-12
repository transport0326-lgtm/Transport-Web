import { createSlice } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagas/sagaConstants";

export interface PlatformConfigData {
  success?: boolean;
  platformCommissionPct: number;
  gstPct: number;
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface PlatformConfigState {
  data: PlatformConfigData | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: PlatformConfigState = {
  data: null,
  loading: false,
  saving: false,
  error: null,
};

const GET_BASE = `${SagaActions.GET}_${SagaActions.ADMIN_PLATFORM_CONFIG}`;
const PATCH_BASE = `${SagaActions.PATCH}_${SagaActions.ADMIN_UPDATE_PLATFORM_CONFIG}`;

export const platformConfigSlice = createSlice({
  name: "platformConfig",
  initialState,
  reducers: {
    clearPlatformConfig: (state) => {
      state.data = null;
      state.loading = false;
      state.saving = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: any) => action.type === GET_BASE, // eslint-disable-line @typescript-eslint/no-explicit-any
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );
    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type === `${GET_BASE}_${SagaActionType.SUCCESS}`,
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        const payload = action.payload ?? {};
        state.data = payload.config ?? payload;
        state.loading = false;
      }
    );
    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type === `${GET_BASE}_${SagaActionType.FAIL}`,
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        state.loading = false;
        state.error = action.payload;
      }
    );

    builder.addMatcher(
      (action: any) => action.type === PATCH_BASE, // eslint-disable-line @typescript-eslint/no-explicit-any
      (state) => {
        state.saving = true;
        state.error = null;
      }
    );
    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type === `${PATCH_BASE}_${SagaActionType.SUCCESS}`,
      (state) => {
        state.saving = false;
      }
    );
    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type === `${PATCH_BASE}_${SagaActionType.FAIL}`,
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        state.saving = false;
        state.error = action.payload;
      }
    );
  },
});

export const { clearPlatformConfig } = platformConfigSlice.actions;
export default platformConfigSlice.reducer;
