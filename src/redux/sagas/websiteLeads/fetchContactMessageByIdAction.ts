import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export interface FetchContactMessageByIdPayload {
  id: string;
}

export const fetchContactMessageById = createAction<FetchContactMessageByIdPayload>(
  `${SagaActions.GET}_${SagaActions.ADMIN_CONTACT_MESSAGE_DETAIL}_${SagaActionType.REQUEST}`,
);
