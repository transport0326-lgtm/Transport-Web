import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export const fetchNotifications = createAction(
  `${SagaActions.GET}_${SagaActions.ADMIN_NOTIFICATIONS}_${SagaActionType.REQUEST}`
);