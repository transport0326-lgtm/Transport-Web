import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export interface ResolveConversationPayload {
  conversationId: string;
  onSuccess?: () => void;
  onError?: () => void;
}

export const resolveConversation = createAction<ResolveConversationPayload>(
  `${SagaActions.PATCH}_${SagaActions.ADMIN_RESOLVE_CONVERSATION}_${SagaActionType.REQUEST}`
);