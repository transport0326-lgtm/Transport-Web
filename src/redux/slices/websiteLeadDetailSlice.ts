import { createSlice } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagas/sagaConstants";

interface WebsiteLeadDetailState {
  data: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: WebsiteLeadDetailState = {
  data: null,
  loading: false,
  error: null,
};

const LOADING_TYPES = [
  `${SagaActions.GET}_${SagaActions.ADMIN_QUOTE_REQUEST_DETAIL}`,
  `${SagaActions.GET}_${SagaActions.ADMIN_BUSINESS_QUOTE_DETAIL}`,
  `${SagaActions.GET}_${SagaActions.ADMIN_CONTACT_MESSAGE_DETAIL}`,
  `${SagaActions.GET}_${SagaActions.ADMIN_JOB_APPLICATION_DETAIL}`,
];

const SUCCESS_TYPES = LOADING_TYPES.map(
  (t) => `${t}_${SagaActionType.SUCCESS}`,
);

const FAIL_TYPES = LOADING_TYPES.map(
  (t) => `${t}_${SagaActionType.FAIL}`,
);

export const websiteLeadDetailSlice = createSlice({
  name: "websiteLeadDetail",
  initialState,
  reducers: {
    clearLeadDetail: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: { type: string }) => LOADING_TYPES.includes(action.type),
      (state) => {
        state.loading = true;
        state.error = null;
        state.data = null;
      },
    );
    builder.addMatcher(
      (action: { type: string }) => SUCCESS_TYPES.includes(action.type),
      (state, action: { type: string; payload: any }) => {
        state.data = action.payload;
        state.loading = false;
      },
    );
    builder.addMatcher(
      (action: { type: string }) => FAIL_TYPES.includes(action.type),
      (state, action: { type: string; payload: string }) => {
        state.loading = false;
        state.error = action.payload;
      },
    );
  },
});

export const { clearLeadDetail } = websiteLeadDetailSlice.actions;
export default websiteLeadDetailSlice.reducer;
