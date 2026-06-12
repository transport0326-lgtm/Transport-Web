import { call, put, takeEvery } from "redux-saga/effects";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { API_ENDPOINTS, apiRequest } from "../../../config/api.config";
import { type ResetPasswordPayload } from "./resetPasswordSagaAction";

function* resetPasswordSaga({ payload }: ResetPasswordPayload): Generator<any, void, any> { // eslint-disable-line @typescript-eslint/no-explicit-any
  yield put({ type: `${SagaActions.SEND}_${SagaActions.RESET_PASSWORD}` });

  try {
    const response = yield call(apiRequest, API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      method: "POST",
      body: JSON.stringify({ token: payload.token, newPassword: payload.newPassword }),
    });

    if (!response) throw new Error("Empty response");

    yield put({
      type: `${SagaActions.SEND}_${SagaActions.RESET_PASSWORD}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    yield put({
      type: `${SagaActions.SEND}_${SagaActions.RESET_PASSWORD}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to reset password",
    });
  }
}

export function* resetPasswordWatcher() {
  yield takeEvery(
    `${SagaActions.SEND}_${SagaActions.RESET_PASSWORD}_${SagaActionType.REQUEST}`,
    resetPasswordSaga
  );
}

export default resetPasswordWatcher;
