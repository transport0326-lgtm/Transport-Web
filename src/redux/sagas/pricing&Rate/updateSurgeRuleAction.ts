import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export interface UpdateSurgeRulePayload {
  vehicleType: "bike" | "auto" | "miniTruck" | "truck";
  ruleId: string;
  name: string;
  multiplier: number;
  maxFareCap?: number | null;
  schedule?: {
    startTime?: string;
    endTime?: string;
    days?: string[];
  };
  onSuccess?: () => void;
  onError?: () => void;
}

export const updateSurgeRule = createAction<UpdateSurgeRulePayload>(
  `${SagaActions.PATCH}_${SagaActions.ADMIN_UPDATE_SURGE_RULE}_${SagaActionType.REQUEST}`
);
