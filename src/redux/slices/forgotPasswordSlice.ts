import { createSlice } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagas/sagaConstants";

interface ForgotPasswordState {
  success: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: ForgotPasswordState = {
  success: false,
  loading: false,
  error: null,
};

export const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    clearForgotPassword: (state) => {
      state.success = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: any) => action.type === `${SagaActions.SEND}_${SagaActions.FORGOT_PASSWORD}`, // eslint-disable-line @typescript-eslint/no-explicit-any
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );
    builder.addMatcher(
      (action: any) => action.type === `${SagaActions.SEND}_${SagaActions.FORGOT_PASSWORD}_${SagaActionType.SUCCESS}`, // eslint-disable-line @typescript-eslint/no-explicit-any
      (state) => {
        state.success = true;
        state.loading = false;
        state.error = null;
      }
    );
    builder.addMatcher(
      (action: any) => action.type === `${SagaActions.SEND}_${SagaActions.FORGOT_PASSWORD}_${SagaActionType.FAIL}`, // eslint-disable-line @typescript-eslint/no-explicit-any
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        state.loading = false;
        state.error = action.payload;
      }
    );
  },
});

export const { clearForgotPassword } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
