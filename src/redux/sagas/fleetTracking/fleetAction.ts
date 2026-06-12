import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export const fetchFleet = createAction<{
  filter?: 'active' | 'idle' | 'offline';
  search?: string;
} | undefined>(
  `${SagaActions.GET}_${SagaActions.ADMIN_FLEET}_${SagaActionType.REQUEST}`
);