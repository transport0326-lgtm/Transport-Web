import { createSlice } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagas/sagaConstants";

export interface BillingRecord {
  _id: string;
  id: string;
  serviceName: string;
  category: string;
  amount: number;
  originalAmount: number;
  paidOn: string;
  nextRenewal: string;
  billingCycle: string;
  autoRemindBefore: string;
  paidVia: string;
  notes: string | null;
  lastEditedAt: string | null;
  daysLeft: number;
  status: "Active" | "Due Soon" | "Expired";
  createdAt: string;
  updatedAt: string;
}

interface BillingData {
  success: boolean;
  total: number;
  records: BillingRecord[];
}

interface BillingState {
  data: BillingData | null;
  loading: boolean;
  error: string | null;
}

const initialState: BillingState = {
  data: null,
  loading: false,
  error: null,
};

export const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    clearBilling: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── GET (fetch) ──────────────────────────────────────────────────────────

    const GET_BASE = `${SagaActions.GET}_${SagaActions.ADMIN_BILLING}`

    builder.addMatcher(
      (action: any) => action.type === `${GET_BASE}`,
      (state) => {
        state.loading = true;
        state.error = null;
      },
    );

    builder.addMatcher(
      (action: any) => action.type === `${GET_BASE}_${SagaActionType.SUCCESS}`,
      (state, action: any) => {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      },
    );

    builder.addMatcher(
      (action: any) => action.type === `${GET_BASE}_${SagaActionType.FAIL}`,
      (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      },
    );

    // ── ADD ──────────────────────────────────────────────────────────────────

    const ADD_BASE = `${SagaActions.ADD}_${SagaActions.ADMIN_BILLING}`;

    builder.addMatcher(
      (action: any) => action.type === `${ADD_BASE}`,
      (state) => {
        state.loading = true;
        state.error = null;
      },
    );

    builder.addMatcher(
      (action: any) => action.type === `${ADD_BASE}_${SagaActionType.SUCCESS}`,
      (state, action: any) => {
        state.loading = false;
        state.error = null;
        if (state.data) {
          state.data.records.push(action.payload);
          state.data.total += 1;
        } else {
          state.data = { success: true, records: [action.payload], total: 1 };
        }
      },
    );

    builder.addMatcher(
      (action: any) => action.type === `${ADD_BASE}_${SagaActionType.FAIL}`,
      (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      },
    );

    // ── UPDATE (patch) ───────────────────────────────────────────────────────

    const PATCH_BASE = `${SagaActions.PATCH}_${SagaActions.ADMIN_BILLING}`;

    builder.addMatcher(
      (action: any) => action.type === `${PATCH_BASE}`,
      (state) => {
        state.loading = true;
        state.error = null;
      },
    );

    builder.addMatcher(
      (action: any) => action.type === `${PATCH_BASE}_${SagaActionType.SUCCESS}`,
      (state, action: any) => {
        state.loading = false;
        state.error = null;
        if (state.data) {
          const idx = state.data.records.findIndex((r) => r._id === action.payload._id);
          if (idx !== -1) state.data.records[idx] = action.payload;
        }
      },
    );

    builder.addMatcher(
      (action: any) => action.type === `${PATCH_BASE}_${SagaActionType.FAIL}`,
      (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      },
    );

    // ── DELETE ───────────────────────────────────────────────────────────────

    const DELETE_BASE = `${SagaActions.DELETE}_${SagaActions.ADMIN_BILLING}`;

    builder.addMatcher(
      (action: any) => action.type === `${DELETE_BASE}`,
      (state) => {
        state.loading = true;
        state.error = null;
      },
    );

    builder.addMatcher(
      (action: any) => action.type === `${DELETE_BASE}_${SagaActionType.SUCCESS}`,
      (state, action: any) => {
        state.loading = false;
        state.error = null;
        if (state.data) {
          state.data.records = state.data.records.filter((r) => r._id !== action.payload.id);
          state.data.total = Math.max(0, state.data.total - 1);
        }
      },
    );

    builder.addMatcher(
      (action: any) => action.type === `${DELETE_BASE}_${SagaActionType.FAIL}`,
      (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      },
    );
  },
});

export const { clearBilling } = billingSlice.actions;
export default billingSlice.reducer;