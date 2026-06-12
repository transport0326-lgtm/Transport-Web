// actions/riderDocumentAction.ts
import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export const updateRiderDocument = createAction<{
  riderId: string;
  docType: string;
  status: string;
}>(
  `${SagaActions.PATCH}_${SagaActions.ADMIN_RIDER_DOCUMENT}_${SagaActionType.REQUEST}`
);