import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export const deleteRider = createAction<{
  riderId: string;
}>(
  `${SagaActions.DELETE}_${SagaActions.ADMIN_RIDER_DETAIL}_${SagaActionType.REQUEST}`
);