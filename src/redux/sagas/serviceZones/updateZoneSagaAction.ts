import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export const updateZone = createAction<{ id: string; data: Record<string, any> }>(
  `${SagaActions.PATCH}_${SagaActions.ADMIN_ZONE}_${SagaActionType.REQUEST}`
);