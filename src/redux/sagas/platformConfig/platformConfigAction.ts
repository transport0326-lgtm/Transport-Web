import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export const fetchPlatformConfig = createAction(
  `${SagaActions.GET}_${SagaActions.ADMIN_PLATFORM_CONFIG}_${SagaActionType.REQUEST}`
);

export const updatePlatformConfig = createAction<{
  platformCommissionPct: number;
  gstPct: number;
  onSuccess?: () => void;
  onError?: () => void;
}>(
  `${SagaActions.PATCH}_${SagaActions.ADMIN_UPDATE_PLATFORM_CONFIG}_${SagaActionType.REQUEST}`
);
