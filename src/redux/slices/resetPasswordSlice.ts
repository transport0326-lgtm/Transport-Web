import { createSlice } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagas/sagaConstants";

interface ResetPasswordState {
  success: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: ResetPasswordState = {
  success: false,
  loading: false,
  error: null,
};

export const resetPasswordSlice = createSlice({
  name: "resetPassword",
  initialState,
  reducers: {
    clearResetPassword: (state) => {
      state.success = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: any) => action.type === `${SagaActions.SEND}_${SagaActions.RESET_PASSWORD}`, // eslint-disable-line @typescript-eslint/no-explicit-any
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );
    builder.addMatcher(
      (action: any) => action.type === `${SagaActions.SEND}_${SagaActions.RESET_PASSWORD}_${SagaActionType.SUCCESS}`, // eslint-disable-line @typescript-eslint/no-explicit-any
      (state) => {
        state.success = true;
        state.loading = false;
        state.error = null;
      }
    );
    builder.addMatcher(
      (action: any) => action.type === `${SagaActions.SEND}_${SagaActions.RESET_PASSWORD}_${SagaActionType.FAIL}`, // eslint-disable-line @typescript-eslint/no-explicit-any
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        state.loading = false;
        state.error = action.payload;
      }
    );
  },
});

export const { clearResetPassword } = resetPasswordSlice.actions;
export default resetPasswordSlice.reducer;
