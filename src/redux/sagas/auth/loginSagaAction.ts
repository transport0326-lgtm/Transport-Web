import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export interface loginPayload {
  payload: {
    email: string;
    password: string;
  };
  type: string;
}

export const login = createAction(
  `${SagaActions.SEND}_${SagaActions.LOGIN}_${SagaActionType.REQUEST}`,
  function prepare(payload: loginPayload["payload"]) {
    return {
      payload: payload,
    };
  },
);
