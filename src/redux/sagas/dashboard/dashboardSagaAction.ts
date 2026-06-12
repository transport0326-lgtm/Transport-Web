import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export const fetchDashboard = createAction(
  `${SagaActions.GET}_${SagaActions.ADMIN_DASHBOARD}_${SagaActionType.REQUEST}`
);
