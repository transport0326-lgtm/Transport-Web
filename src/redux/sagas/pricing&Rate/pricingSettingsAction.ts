import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export const fetchPricingSettings = createAction(
  `${SagaActions.GET}_${SagaActions.PRICING_SETTINGS}_${SagaActionType.REQUEST}`
);