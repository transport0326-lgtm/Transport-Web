import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export const fetchSupportCount = createAction(
  `${SagaActions.GET}_${SagaActions.ADMIN_SUPPORT_COUNT}_${SagaActionType.REQUEST}`
);
