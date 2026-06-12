import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export interface FetchContactMessagesPayload {
  status?: "unread" | "read" | "replied" | "all";
  page?: number;
  limit?: number;
}

export const fetchContactMessages = createAction<FetchContactMessagesPayload>(
  `${SagaActions.GET}_${SagaActions.ADMIN_CONTACT_MESSAGES}_${SagaActionType.REQUEST}`,
);
