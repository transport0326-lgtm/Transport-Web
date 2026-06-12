import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export interface SendMessagePayload {
  conversationId: string;
  text: string;
}

export const sendMessage = createAction<SendMessagePayload>(
  `${SagaActions.POST}_${SagaActions.ADMIN_SEND_MESSAGE}_${SagaActionType.REQUEST}`
);
