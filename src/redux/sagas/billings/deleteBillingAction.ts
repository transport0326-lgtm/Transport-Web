import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export const deleteBilling = createAction<{ id: string }>(
  `${SagaActions.DELETE}_${SagaActions.ADMIN_BILLING}_${SagaActionType.REQUEST}`
);
