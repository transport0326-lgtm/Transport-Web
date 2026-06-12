import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export interface FetchSupportConversationsPayload {
  status?: "open" | "resolved";
  type?: "user" | "rider";
}

export const fetchSupportConversations = createAction<FetchSupportConversationsPayload>(
  `${SagaActions.GET}_${SagaActions.ADMIN_SUPPORT_CONVERSATIONS}_${SagaActionType.REQUEST}`
);