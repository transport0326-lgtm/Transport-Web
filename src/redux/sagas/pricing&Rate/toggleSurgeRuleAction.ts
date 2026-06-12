import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export const toggleSurgeRule = createAction<{
  vehicleType: "bike" | "auto" | "miniTruck" | "truck";
  ruleId: string;
  onSuccess?: () => void;
  onError?: () => void;
}>(
  `${SagaActions.PATCH}_${SagaActions.ADMIN_TOGGLE_SURGE_RULE}_${SagaActionType.REQUEST}`
);
