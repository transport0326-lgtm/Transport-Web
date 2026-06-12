// slices/reportsSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagas/sagaConstants";

// Interfaces
export interface PeriodInfo {
  from: string;
  to: string;
}

export interface MetricWithChange {
  current: number | null;
  previous: number | null;
  changePercent?: number | null;
  change?: number | null;
}

export interface ReportsSummary {
  totalDeliveries: MetricWithChange;
  totalRevenue: MetricWithChange;
  avgDeliveryMin: MetricWithChange;
  avgRating: MetricWithChange;
  activeRiders: MetricWithChange;
}

export interface WeeklyTrend {
  week: string;
  deliveries: number;
  revenue: number;
}

export interface TrendPoint {
  label: string;
  deliveries: number;
  revenue: number;
}

export interface ReportsFilter {
  startDate: string;
  endDate: string;
  label: string;
  groupBy: "day" | "week" | "month" | "year" | "error";
  labels: string[];
}

export interface RevenueByVehicleType {
  vehicleType: string;
  revenue: number;
  deliveries: number;
}

export interface TopRider {
  rank: number;
  riderId: string;
  name: string;
  vehicleNumber: string;
  deliveries: number;
  revenue: number;
  avgDeliveryMin: number;
  status: string;
}

export interface ReportsData {
  success: boolean;
  period?: PeriodInfo;
  filter?: ReportsFilter;
  summary: ReportsSummary;
  weeklyTrends?: WeeklyTrend[];
  trends?: TrendPoint[];
  revenueByVehicleType: RevenueByVehicleType[];
  topRiders: TopRider[];
}

interface ReportsState {
  data: ReportsData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  data: null,
  loading: false,
  error: null,
};

export const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    clearReports: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type === `${SagaActions.GET}_${SagaActions.ADMIN_REPORTS}`,
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type ===
        `${SagaActions.GET}_${SagaActions.ADMIN_REPORTS}_${SagaActionType.SUCCESS}`,
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        state.data = action.payload;
        state.loading = false;
      }
    );

    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type ===
        `${SagaActions.GET}_${SagaActions.ADMIN_REPORTS}_${SagaActionType.FAIL}`,
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        state.loading = false;
        state.error = action.payload;
      }
    );

    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type === `${SagaActions.GET}_${SagaActions.REPORTS_BY_DATE}`,
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type ===
        `${SagaActions.GET}_${SagaActions.REPORTS_BY_DATE}_${SagaActionType.SUCCESS}`,
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        state.data = action.payload;
        state.loading = false;
      }
    );

    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type ===
        `${SagaActions.GET}_${SagaActions.REPORTS_BY_DATE}_${SagaActionType.FAIL}`,
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        state.loading = false;
        state.error = action.payload;
      }
    );
  },
});

export const { clearReports } = reportsSlice.actions;
export default reportsSlice.reducer;