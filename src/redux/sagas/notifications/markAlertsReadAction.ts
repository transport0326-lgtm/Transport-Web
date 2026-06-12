import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export const markAlertsRead = createAction<{ id: string }>(
  `${SagaActions.PATCH}_${SagaActions.ADMIN_MARK_ALERTS_READ}_${SagaActionType.REQUEST}`
);
