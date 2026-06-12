import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export interface FetchJobApplicationsPayload {
  status?: "applied" | "reviewing" | "shortlisted" | "rejected" | "hired" | "all";
  position?: string;
  page?: number;
  limit?: number;
}

export const fetchJobApplications = createAction<FetchJobApplicationsPayload>(
  `${SagaActions.GET}_${SagaActions.ADMIN_JOB_APPLICATIONS}_${SagaActionType.REQUEST}`,
);
