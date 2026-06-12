import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export interface FetchQuoteRequestByIdPayload {
  id: string;
}

export const fetchQuoteRequestById = createAction<FetchQuoteRequestByIdPayload>(
  `${SagaActions.GET}_${SagaActions.ADMIN_QUOTE_REQUEST_DETAIL}_${SagaActionType.REQUEST}`,
);
