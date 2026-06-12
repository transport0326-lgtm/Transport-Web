import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export interface ForgotPasswordPayload {
  payload: { email: string };
  type: string;
}

export const forgotPassword = createAction(
  `${SagaActions.SEND}_${SagaActions.FORGOT_PASSWORD}_${SagaActionType.REQUEST}`,
  function prepare(payload: ForgotPasswordPayload["payload"]) {
    return { payload };
  }
);
