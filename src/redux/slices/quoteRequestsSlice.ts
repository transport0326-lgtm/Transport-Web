import { createSlice } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagas/sagaConstants";

export interface QuoteRequest {
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

export interface QuoteRequestsData {
  success: boolean;
  total: number;
  page: number;
  quotes: QuoteRequest[];
}

interface QuoteRequestsState {
  data: QuoteRequestsData | null;
  loading: boolean;
  error: string | null;
}

const initialState: QuoteRequestsState = {
  data: null,
  loading: false,
  error: null,
};

export const quoteRequestsSlice = createSlice({
  name: "quoteRequests",
  initialState,
  reducers: {
    clearQuoteRequests: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: { type: string }) =>
        action.type === `${SagaActions.GET}_${SagaActions.ADMIN_QUOTE_REQUESTS}`,
      (state) => {
        state.loading = true;
        state.error = null;
      },
    );
    builder.addMatcher(
      (action: { type: string }) =>
        action.type ===
        `${SagaActions.GET}_${SagaActions.ADMIN_QUOTE_REQUESTS}_${SagaActionType.SUCCESS}`,
      (state, action: { type: string; payload: QuoteRequestsData }) => {
        state.data = action.payload;
        state.loading = false;
      },
    );
    builder.addMatcher(
      (action: { type: string }) =>
        action.type ===
        `${SagaActions.GET}_${SagaActions.ADMIN_QUOTE_REQUESTS}_${SagaActionType.FAIL}`,
      (state, action: { type: string; payload: string }) => {
        state.loading = false;
        state.error = action.payload;
      },
    );
  },
});

export const { clearQuoteRequests } = quoteRequestsSlice.actions;
export default quoteRequestsSlice.reducer;
