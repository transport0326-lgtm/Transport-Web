import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export const unsuspendRider = createAction<{ riderId: string }>(
  `${SagaActions.PATCH}_${SagaActions.UNSUSPEND_RIDER}_${SagaActionType.REQUEST}`
);
