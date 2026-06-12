import { createSlice } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagas/sagaConstants";

export interface SupportConversation {
  _id: string;
  senderName: string;
  senderType: "user" | "rider";
  senderPhone: string;
  status: "open" | "resolved";
  lastMessage: string | null;
  lastMessageAt: string;
  unreadByAdmin: number;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
}

interface SupportConversationsState {
  conversations: SupportConversation[];
  loading: boolean;
  error: string | null;
}

const initialState: SupportConversationsState = {
  conversations: [],
  loading: false,
  error: null,
};

export const supportConversationsSlice = createSlice({
  name: "supportConversations",
  initialState,
  reducers: {
    clearSupportConversations: (state) => {
      state.conversations = [];
      state.loading = false;
      state.error = null;
    },
    socketConversationUpdated: (
      state,
      action: { payload: Partial<SupportConversation> & { _id: string } }
    ) => {
      const idx = state.conversations.findIndex((c) => c._id === action.payload._id);
      if (idx !== -1) {
        state.conversations[idx] = { ...state.conversations[idx], ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: { type: string }) =>
        action.type ===
        `${SagaActions.GET}_${SagaActions.ADMIN_SUPPORT_CONVERSATIONS}`,
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );
    builder.addMatcher(
      (action: { type: string }) =>
        action.type ===
        `${SagaActions.GET}_${SagaActions.ADMIN_SUPPORT_CONVERSATIONS}_${SagaActionType.SUCCESS}`,
      (
        state,
        action: { type: string; payload: { conversations: SupportConversation[] } }
      ) => {
        state.conversations =
          action.payload?.conversations ?? action.payload;
        state.loading = false;
      }
    );
    builder.addMatcher(
      (action: { type: string }) =>
        action.type ===
        `${SagaActions.GET}_${SagaActions.ADMIN_SUPPORT_CONVERSATIONS}_${SagaActionType.FAIL}`,
      (state, action: { type: string; payload: string }) => {
        state.loading = false;
        state.error = action.payload;
      }
    );
  },
});

export const { clearSupportConversations, socketConversationUpdated } =
  supportConversationsSlice.actions;
export default supportConversationsSlice.reducer;