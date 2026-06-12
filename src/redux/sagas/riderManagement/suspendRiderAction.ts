import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

// actions/riderActions.ts
export const suspendRider = createAction<{
  riderId: string;
  reason: string;
  duration: string;
  notes?: string;
}>(
  `${SagaActions.PATCH}_${SagaActions.SUSPEND_RIDER}_${SagaActionType.REQUEST}`
);