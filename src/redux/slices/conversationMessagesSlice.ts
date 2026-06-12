import { createSlice } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagas/sagaConstants";

export interface ConversationMessage {
  _id: string;
  conversationId: string;
  text: string;
  senderType: "admin" | "user" | "rider";
  senderId: string;
  createdAt: string;
}

interface ConversationMessagesState {
  messages: ConversationMessage[];
  loading: boolean;
  error: string | null;
  uploadLoading: boolean;
  uploadError: string | null;
}

const initialState: ConversationMessagesState = {
  messages: [],
  loading: false,
  error: null,
  uploadLoading: false,
  uploadError: null,
};

export const conversationMessagesSlice = createSlice({
  name: "conversationMessages",
  initialState,
  reducers: {
    clearConversationMessages: (state) => {
      state.messages = [];
      state.loading = false;
      state.error = null;
    },
    socketMessageReceived: (state, action: { payload: ConversationMessage }) => {
      const exists = state.messages.some((m) => m._id === action.payload._id);
      if (!exists) state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type === `${SagaActions.GET}_${SagaActions.ADMIN_CONVERSATION_MESSAGES}`,
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );
    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type === `${SagaActions.GET}_${SagaActions.ADMIN_CONVERSATION_MESSAGES}_${SagaActionType.SUCCESS}`,
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        state.messages = action.payload?.messages ?? action.payload;
        state.loading = false;
      }
    );
    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type === `${SagaActions.GET}_${SagaActions.ADMIN_CONVERSATION_MESSAGES}_${SagaActionType.FAIL}`,
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        state.loading = false;
        state.error = action.payload;
      }
    );
    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type === `${SagaActions.POST}_${SagaActions.ADMIN_SEND_MESSAGE}_${SagaActionType.SUCCESS}`,
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        const msg = action.payload?.message ?? action.payload;
        if (msg) state.messages.push(msg);
      }
    );

    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type === `${SagaActions.POST}_${SagaActions.ADMIN_UPLOAD_CHAT}_${SagaActionType.REQUEST}`,
      (state) => {
        state.uploadLoading = true;
        state.uploadError = null;
      }
    );
    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type === `${SagaActions.POST}_${SagaActions.ADMIN_UPLOAD_CHAT}_${SagaActionType.SUCCESS}`,
      (state) => {
        state.uploadLoading = false;
      }
    );
    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type === `${SagaActions.POST}_${SagaActions.ADMIN_UPLOAD_CHAT}_${SagaActionType.FAIL}`,
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        state.uploadLoading = false;
        state.uploadError = action.payload;
      }
    );
  },
});

export const { clearConversationMessages, socketMessageReceived } = conversationMessagesSlice.actions;
export default conversationMessagesSlice.reducer;