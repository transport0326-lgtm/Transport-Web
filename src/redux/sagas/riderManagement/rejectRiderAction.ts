import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

// actions/riderActions.ts
export const rejectRider = createAction<{
  riderId: string;
  rejectionReason?: string;
}>(
  `${SagaActions.PATCH}_${SagaActions.REJECT_RIDER}_${SagaActionType.REQUEST}`
);