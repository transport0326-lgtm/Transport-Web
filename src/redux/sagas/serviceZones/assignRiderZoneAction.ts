import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export const assignRiderZone = createAction<{
  riderId: string;
  zoneId: string;
}>(
  `${SagaActions.PATCH}_${SagaActions.ADMIN_ZONES_ASSIGN_RIDER}_${SagaActionType.REQUEST}`
);