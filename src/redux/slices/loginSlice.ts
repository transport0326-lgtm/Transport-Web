import { createSlice } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagas/sagaConstants";

interface AdminInfo {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface LoginState {
  data: { success: boolean; token: string; admin: AdminInfo } | null;
  loading: boolean;
  error: string | null;
}

const initialState: LoginState = {
  data: null,
  loading: false,
  error: null,
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    clearLogin: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type ===
        `${SagaActions.SEND}_${SagaActions.LOGIN}`,
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type ===
        `${SagaActions.SEND}_${SagaActions.LOGIN}_${SagaActionType.SUCCESS}`,
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      }
    );

    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type ===
        `${SagaActions.SEND}_${SagaActions.LOGIN}_${SagaActionType.FAIL}`,
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        state.loading = false;
        state.error = action.payload;
      }
    );
  },
});

export const { clearLogin } = loginSlice.actions;
export default loginSlice.reducer;
