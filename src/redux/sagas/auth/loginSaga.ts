import { call, put, takeEvery, spawn } from "redux-saga/effects";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { API_ENDPOINTS, apiRequest } from "../../../config/api.config";
import { type loginPayload } from "./loginSagaAction";

export function* loginSaga({ payload }: loginPayload): Generator<any, void, any> { // eslint-disable-line @typescript-eslint/no-explicit-any
  yield put({
    type: `${SagaActions.SEND}_${SagaActions.LOGIN}`,
  });

  try {
    const response = yield call(apiRequest, API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
      }),
    });

    if (!response) throw new Error("Empty response");

    if (response.token) {
      localStorage.setItem("token", response.token);
    }

    yield put({
      type: `${SagaActions.SEND}_${SagaActions.LOGIN}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    yield put({
      type: `${SagaActions.SEND}_${SagaActions.LOGIN}_${SagaActionType.FAIL}`,
      payload: error?.message || "Login failed",
    });
  }
}

export function* loginWatcher() {
  yield takeEvery(
    `${SagaActions.SEND}_${SagaActions.LOGIN}_${SagaActionType.REQUEST}`,
    loginSaga,
  );
}

export function* rootSaga() {
  yield spawn(loginWatcher);
}

export default rootSaga;
