import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export const fetchZoneConfig = createAction(
  `${SagaActions.GET}_${SagaActions.ADMIN_ZONE_CONFIG}_${SagaActionType.REQUEST}`
);

export const updateZoneConfig = createAction<{
  defaultRadiusKm: number;
  overlapAllowed: boolean;
  autoExpandOnHighDemand: boolean;
}>(
  `${SagaActions.PATCH}_${SagaActions.ADMIN_ZONE_CONFIG}_${SagaActionType.REQUEST}`
);