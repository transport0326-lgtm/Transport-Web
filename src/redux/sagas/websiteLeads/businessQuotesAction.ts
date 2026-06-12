import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export interface FetchBusinessQuotesPayload {
  status?: "pending" | "contacted" | "closed" | "all";
  page?: number;
  limit?: number;
}

export const fetchBusinessQuotes = createAction<FetchBusinessQuotesPayload>(
  `${SagaActions.GET}_${SagaActions.ADMIN_BUSINESS_QUOTES}_${SagaActionType.REQUEST}`,
);
