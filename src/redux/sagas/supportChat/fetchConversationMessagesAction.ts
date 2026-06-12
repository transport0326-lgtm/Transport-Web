import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export interface FetchConversationMessagesPayload {
  conversationId: string;
}

export const fetchConversationMessages = createAction<FetchConversationMessagesPayload>(
  `${SagaActions.GET}_${SagaActions.ADMIN_CONVERSATION_MESSAGES}_${SagaActionType.REQUEST}`
);