// slices/companyProfileSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagas/sagaConstants";

interface ZoneConfig {
  autoExpandOnHighDemand: boolean;
  defaultRadiusKm: number;
  overlapAllowed: boolean;
}

interface CompanySettings {
  _id: string;
  companyId: string;
  __v: number;
  businessAddress: string | null;
  companyName: string | null;
  contactEmail: string | null;
  createdAt: string;
  defaultCurrency: string;
  gstNumber: string | null;
  phoneNumber: string | null;
  updatedAt: string;
  zoneConfig: ZoneConfig;
}

interface CompanyProfileData {
  success: boolean;
  settings: CompanySettings;
}

interface CompanyProfileState {
  data: CompanyProfileData | null;
  loading: boolean;
  error: string | null;
}

const initialState: CompanyProfileState = {
  data: null,
  loading: false,
  error: null,
};

export const companyProfileSlice = createSlice({
  name: "companyProfile",
  initialState,
  reducers: {
    clearCompanyProfile: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (
        action: any, // eslint-disable-line @typescript-eslint/no-explicit-any
      ) => action.type === `${SagaActions.GET}_${SagaActions.COMPANY_PROFILE}`,
      (state) => {
        state.loading = true;
        state.error = null;
      },
    );

    builder.addMatcher(
      (
        action: any, // eslint-disable-line @typescript-eslint/no-explicit-any
      ) =>
        action.type ===
        `${SagaActions.GET}_${SagaActions.COMPANY_PROFILE}_${SagaActionType.SUCCESS}`,
      (state, action: any) => {
        // eslint-disable-line @typescript-eslint/no-explicit-any
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      },
    );

    builder.addMatcher(
      (
        action: any, // eslint-disable-line @typescript-eslint/no-explicit-any
      ) =>
        action.type ===
        `${SagaActions.GET}_${SagaActions.COMPANY_PROFILE}_${SagaActionType.FAIL}`,
      (state, action: any) => {
        // eslint-disable-line @typescript-eslint/no-explicit-any
        state.loading = false;
        state.error = action.payload;
      },
    );

    const PATCH_BASE = `${SagaActions.PATCH}_${SagaActions.COMPANY_PROFILE}`;

    builder.addMatcher(
      (action: any) => action.type === `${PATCH_BASE}`,
      (state) => {
        state.loading = true;
        state.error = null;
      },
    );

    builder.addMatcher(
      (action: any) =>
        action.type === `${PATCH_BASE}_${SagaActionType.SUCCESS}`,
      (state, action: any) => {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      },
    );

    builder.addMatcher(
      (action: any) => action.type === `${PATCH_BASE}_${SagaActionType.FAIL}`,
      (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      },
    );
  },
});

export const { clearCompanyProfile } = companyProfileSlice.actions;
export default companyProfileSlice.reducer;
