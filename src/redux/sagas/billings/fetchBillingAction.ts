import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export const fetchBilling = createAction(
  `${SagaActions.GET}_${SagaActions.ADMIN_BILLING}_${SagaActionType.REQUEST}`
);