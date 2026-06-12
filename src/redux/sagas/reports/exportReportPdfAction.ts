import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export const exportReportExcel = createAction<{
  from: string; // "YYYY-MM-DD"
  to: string;   // "YYYY-MM-DD"
}>(
  `${SagaActions.GET}_${SagaActions.ADMIN_REPORTS_EXPORT_EXCEL}_${SagaActionType.REQUEST}`
);
