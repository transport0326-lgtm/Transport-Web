import { createSlice } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagas/sagaConstants";

export interface JobApplication {
  _id: string;
  formId?: string;
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  position?: string;
  resumeUrl?: string;
  status?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface JobApplicationsData {
  success: boolean;
  total: number;
  page: number;
  jobApplications: JobApplication[];
}

interface JobApplicationsState {
  data: JobApplicationsData | null;
  loading: boolean;
  error: string | null;
}

const initialState: JobApplicationsState = {
  data: null,
  loading: false,
  error: null,
};

export const jobApplicationsSlice = createSlice({
  name: "jobApplications",
  initialState,
  reducers: {
    clearJobApplications: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: { type: string }) =>
        action.type === `${SagaActions.GET}_${SagaActions.ADMIN_JOB_APPLICATIONS}`,
      (state) => {
        state.loading = true;
        state.error = null;
      },
    );
    builder.addMatcher(
      (action: { type: string }) =>
        action.type ===
        `${SagaActions.GET}_${SagaActions.ADMIN_JOB_APPLICATIONS}_${SagaActionType.SUCCESS}`,
      (state, action: { type: string; payload: JobApplicationsData }) => {
        state.data = action.payload;
        state.loading = false;
      },
    );
    builder.addMatcher(
      (action: { type: string }) =>
        action.type ===
        `${SagaActions.GET}_${SagaActions.ADMIN_JOB_APPLICATIONS}_${SagaActionType.FAIL}`,
      (state, action: { type: string; payload: string }) => {
        state.loading = false;
        state.error = action.payload;
      },
    );
  },
});

export const { clearJobApplications } = jobApplicationsSlice.actions;
export default jobApplicationsSlice.reducer;
