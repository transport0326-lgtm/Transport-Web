import { createSlice } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagas/sagaConstants";

export interface BusinessQuote {
  _id: string;
  formId?: string;
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  reason?: string;
  status?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface BusinessQuotesData {
  success: boolean;
  total: number;
  page: number;
  businessQuotes: BusinessQuote[];
}

interface BusinessQuotesState {
  data: BusinessQuotesData | null;
  loading: boolean;
  error: string | null;
}

const initialState: BusinessQuotesState = {
  data: null,
  loading: false,
  error: null,
};

export const businessQuotesSlice = createSlice({
  name: "businessQuotes",
  initialState,
  reducers: {
    clearBusinessQuotes: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: { type: string }) =>
        action.type === `${SagaActions.GET}_${SagaActions.ADMIN_BUSINESS_QUOTES}`,
      (state) => {
        state.loading = true;
        state.error = null;
      },
    );
    builder.addMatcher(
      (action: { type: string }) =>
        action.type ===
        `${SagaActions.GET}_${SagaActions.ADMIN_BUSINESS_QUOTES}_${SagaActionType.SUCCESS}`,
      (state, action: { type: string; payload: BusinessQuotesData }) => {
        state.data = action.payload;
        state.loading = false;
      },
    );
    builder.addMatcher(
      (action: { type: string }) =>
        action.type ===
        `${SagaActions.GET}_${SagaActions.ADMIN_BUSINESS_QUOTES}_${SagaActionType.FAIL}`,
      (state, action: { type: string; payload: string }) => {
        state.loading = false;
        state.error = action.payload;
      },
    );
  },
});

export const { clearBusinessQuotes } = businessQuotesSlice.actions;
export default businessQuotesSlice.reducer;
