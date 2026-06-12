import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export const fetchAlertsCount = createAction(
  `${SagaActions.GET}_${SagaActions.ADMIN_ALERTS_COUNT}_${SagaActionType.REQUEST}`
);
