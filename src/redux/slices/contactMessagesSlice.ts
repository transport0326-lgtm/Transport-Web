import { createSlice } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagas/sagaConstants";

export interface ContactMessage {
  _id: string;
  formId?: string;
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  subject?: string;
  message?: string;
  status?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface ContactMessagesData {
  success: boolean;
  total: number;
  page: number;
  contactMessages: ContactMessage[];
}

interface ContactMessagesState {
  data: ContactMessagesData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ContactMessagesState = {
  data: null,
  loading: false,
  error: null,
};

export const contactMessagesSlice = createSlice({
  name: "contactMessages",
  initialState,
  reducers: {
    clearContactMessages: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: { type: string }) =>
        action.type === `${SagaActions.GET}_${SagaActions.ADMIN_CONTACT_MESSAGES}`,
      (state) => {
        state.loading = true;
        state.error = null;
      },
    );
    builder.addMatcher(
      (action: { type: string }) =>
        action.type ===
        `${SagaActions.GET}_${SagaActions.ADMIN_CONTACT_MESSAGES}_${SagaActionType.SUCCESS}`,
      (state, action: { type: string; payload: ContactMessagesData }) => {
        state.data = action.payload;
        state.loading = false;
      },
    );
    builder.addMatcher(
      (action: { type: string }) =>
        action.type ===
        `${SagaActions.GET}_${SagaActions.ADMIN_CONTACT_MESSAGES}_${SagaActionType.FAIL}`,
      (state, action: { type: string; payload: string }) => {
        state.loading = false;
        state.error = action.payload;
      },
    );
  },
});

export const { clearContactMessages } = contactMessagesSlice.actions;
export default contactMessagesSlice.reducer;
