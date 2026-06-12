// actions/reportsActions.ts
import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export const fetchReportsByDate = createAction<{
  from: string;
  to: string;
}>(
  `${SagaActions.GET}_${SagaActions.REPORTS_BY_DATE}_${SagaActionType.REQUEST}`
);