import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export const fetchZoneSettings = createAction(
  `${SagaActions.GET}_${SagaActions.ZONE_SETTINGS}_${SagaActionType.REQUEST}`
);