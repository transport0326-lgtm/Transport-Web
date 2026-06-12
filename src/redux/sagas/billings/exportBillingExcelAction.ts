import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export const exportBillingExcel = createAction(
  `${SagaActions.GET}_${SagaActions.BILLING_EXPORT_EXCEL}_${SagaActionType.REQUEST}`
);