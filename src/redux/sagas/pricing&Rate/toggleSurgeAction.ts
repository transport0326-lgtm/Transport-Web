import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export const toggleSurge = createAction<{
  vehicleType: "bike" | "auto" | "miniTruck" | "truck";
  surgeEnabled: boolean;
  onSuccess?: () => void;
  onError?: () => void;
}>(
  `${SagaActions.PATCH}_${SagaActions.ADMIN_TOGGLE_SURGE}_${SagaActionType.REQUEST}`
);
