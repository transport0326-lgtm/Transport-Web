import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export const fetchRiderDetail = createAction<{
  riderId: string;
}>(
  `${SagaActions.GET}_${SagaActions.ADMIN_RIDER_DETAIL}_${SagaActionType.REQUEST}`
);