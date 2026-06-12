import { createSlice } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagas/sagaConstants";

export interface AlertsCountData {
  success: boolean;
  count: number;
}

interface AlertsCountState {
  data: AlertsCountData | null;
  loading: boolean;
  error: string | null;
}

const initialState: AlertsCountState = {
  data: null,
  loading: false,
  error: null,
};

export const alertsCountSlice = createSlice({
  name: "alertsCount",
  initialState,
  reducers: {
    clearAlertsCount: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type === `${SagaActions.GET}_${SagaActions.ADMIN_ALERTS_COUNT}`,
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type ===
        `${SagaActions.GET}_${SagaActions.ADMIN_ALERTS_COUNT}_${SagaActionType.SUCCESS}`,
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      }
    );

    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type ===
        `${SagaActions.GET}_${SagaActions.ADMIN_ALERTS_COUNT}_${SagaActionType.FAIL}`,
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        state.loading = false;
        state.error = action.payload;
      }
    );
  },
});

export const { clearAlertsCount } = alertsCountSlice.actions;
export default alertsCountSlice.reducer;
