// riderManagement/createZoneAction.ts
import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export interface CreateZonePayload {
  riderId: string;
  name: string;
  city: string;
  state: string;
  areaCoverage: number;
  maxActiveRiders: number;
  minOrderValue: number;
  baseDeliveryFee: number;
  perKmRate: number;
  description: string;
  isActive: boolean;
}

export const createZone = createAction<CreateZonePayload>(
  `${SagaActions.POST}_${SagaActions.ADMIN_CREATE_ZONE}_${SagaActionType.REQUEST}`,
);
