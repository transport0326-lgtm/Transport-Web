// actions/reportsActions.ts
import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export const fetchReports = createAction(
  `${SagaActions.GET}_${SagaActions.ADMIN_REPORTS}_${SagaActionType.REQUEST}`
);