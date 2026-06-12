import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export interface OnboardRiderPayload {
  phone: string;
  name: string;
  email: string;
  vehicleType: string;
  vehicleNumber: string;
  dlNumber: string;
  dlPhotoUrl: string;
  rcNumber: string;
  rcPhotoUrl: string;
  currentAddress: string;
  zoneId: string;
}

export const onboardRider = createAction<OnboardRiderPayload>(
  `${SagaActions.POST}_${SagaActions.ONBOARD_RIDER}_${SagaActionType.REQUEST}`
);
