import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export interface FetchJobApplicationByIdPayload {
  id: string;
}

export const fetchJobApplicationById = createAction<FetchJobApplicationByIdPayload>(
  `${SagaActions.GET}_${SagaActions.ADMIN_JOB_APPLICATION_DETAIL}_${SagaActionType.REQUEST}`,
);
