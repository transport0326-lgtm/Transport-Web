// actions/serviceZonesAction.ts
import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export const createServiceZone = createAction<{
  name: string;
  city: string;
  state: string;
  areaCoverage: number;
  isActive: boolean;
  maxActiveRiders?: number;
  minOrderValue?: number;
  baseDeliveryFee?: number;
  description?: string;
}>(
  `${SagaActions.POST}_${SagaActions.ADMIN_SERVICE_ZONES}_${SagaActionType.REQUEST}`
);

export const deleteServiceZone = createAction<{
  zoneId: string;
}>(
  `${SagaActions.DELETE}_${SagaActions.ADMIN_SERVICE_ZONES}_${SagaActionType.REQUEST}`
);