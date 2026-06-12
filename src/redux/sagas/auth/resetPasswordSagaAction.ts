import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export interface ResetPasswordPayload {
  payload: { token: string; newPassword: string };
  type: string;
}

export const resetPassword = createAction(
  `${SagaActions.SEND}_${SagaActions.RESET_PASSWORD}_${SagaActionType.REQUEST}`,
  function prepare(payload: ResetPasswordPayload["payload"]) {
    return { payload };
  }
);
