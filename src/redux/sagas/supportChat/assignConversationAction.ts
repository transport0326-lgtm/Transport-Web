import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export interface AssignConversationPayload {
  conversationId: string;
  adminId: string;
  onSuccess?: () => void;
  onError?: () => void;
}

export const assignConversation = createAction<AssignConversationPayload>(
  `${SagaActions.PATCH}_${SagaActions.ADMIN_ASSIGN_CONVERSATION}_${SagaActionType.REQUEST}`
);