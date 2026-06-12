import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export const updatePricing = createAction<{
  vehicleType: "bike" | "auto" | "miniTruck" | "truck";
  baseFare: number;
  baseKmIncluded?: number;
  perKmRate: number;
  perMinRate?: number;
  minFare?: number;
  rate0to10?: number;
  rate10to25?: number;
  rate25plus?: number;
  surgeEnabled?: boolean;
  maxSurgeCap?: number;
  onSuccess?: () => void;
  onError?: () => void;
}>(
  `${SagaActions.PATCH}_${SagaActions.ADMIN_SETTINGS_PRICING}_${SagaActionType.REQUEST}`
);