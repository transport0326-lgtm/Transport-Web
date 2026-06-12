import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export interface FetchBusinessQuoteByIdPayload {
  id: string;
}

export const fetchBusinessQuoteById = createAction<FetchBusinessQuoteByIdPayload>(
  `${SagaActions.GET}_${SagaActions.ADMIN_BUSINESS_QUOTE_DETAIL}_${SagaActionType.REQUEST}`,
);
