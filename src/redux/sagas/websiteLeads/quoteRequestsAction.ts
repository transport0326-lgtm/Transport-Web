import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export interface FetchQuoteRequestsPayload {
  status?: "pending" | "contacted" | "closed" | "all";
  page?: number;
  limit?: number;
}

export const fetchQuoteRequests = createAction<FetchQuoteRequestsPayload>(
  `${SagaActions.GET}_${SagaActions.ADMIN_QUOTE_REQUESTS}_${SagaActionType.REQUEST}`,
);
