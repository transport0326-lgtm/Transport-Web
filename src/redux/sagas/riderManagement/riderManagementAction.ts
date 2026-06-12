import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export const fetchRiderManagement = createAction<{
  tab: "pending" | "approved" | "rejected" | "suspended";
  search?: string;
  vehicleType?: string;
  page?: number;
  limit?: number;
}>(
  `${SagaActions.GET}_${SagaActions.ADMIN_RIDER_MANAGEMENT}_${SagaActionType.REQUEST}`
);