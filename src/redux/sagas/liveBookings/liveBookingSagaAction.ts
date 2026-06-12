import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export interface LiveBookingsParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const fetchLiveBookings = createAction<LiveBookingsParams | undefined>(
  `${SagaActions.GET}_${SagaActions.ADMIN_LIVE_BOOKINGS}_${SagaActionType.REQUEST}`
);