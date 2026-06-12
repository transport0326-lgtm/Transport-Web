import { call, put, takeEvery } from "redux-saga/effects";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { API_ENDPOINTS, apiRequest } from "../../../config/api.config";
import { type ForgotPasswordPayload } from "./forgotPasswordSagaAction";

function* forgotPasswordSaga({ payload }: ForgotPasswordPayload): Generator<any, void, any> { // eslint-disable-line @typescript-eslint/no-explicit-any
  yield put({ type: `${SagaActions.SEND}_${SagaActions.FORGOT_PASSWORD}` });

  try {
    const response = yield call(apiRequest, API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      method: "POST",
      body: JSON.stringify({ email: payload.email }),
    });

    if (!response) throw new Error("Empty response");

    yield put({
      type: `${SagaActions.SEND}_${SagaActions.FORGOT_PASSWORD}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    yield put({
      type: `${SagaActions.SEND}_${SagaActions.FORGOT_PASSWORD}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to send reset email",
    });
  }
}

export function* forgotPasswordWatcher() {
  yield takeEvery(
    `${SagaActions.SEND}_${SagaActions.FORGOT_PASSWORD}_${SagaActionType.REQUEST}`,
    forgotPasswordSaga
  );
}

export default forgotPasswordWatcher;
