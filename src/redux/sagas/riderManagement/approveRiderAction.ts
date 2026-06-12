// actions/riderActions.ts
import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export const approveRider = createAction<{
  riderId: string;
}>(
  `${SagaActions.PATCH}_${SagaActions.APPROVE_RIDER}_${SagaActionType.REQUEST}`
);