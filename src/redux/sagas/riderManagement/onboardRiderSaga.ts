import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import type { OnboardRiderPayload } from "./onboardRiderAction";
import { getAuthToken } from "../../../utils/auth";

function* onboardRiderSaga(action: {
  type: string;
  payload: OnboardRiderPayload;
}): Generator<any, void, any> {
  yield put({
    type: `${SagaActions.POST}_${SagaActions.ONBOARD_RIDER}`,
  });

  try {
    const token = getAuthToken();

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.RIDER_MANAGEMENT}/onboard`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(action.payload),
      }
    );

    yield put({
      type: `${SagaActions.POST}_${SagaActions.ONBOARD_RIDER}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.POST}_${SagaActions.ONBOARD_RIDER}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to onboard rider",
    });
  }
}

export function* onboardRiderWatcher() {
  yield takeLatest(
    `${SagaActions.POST}_${SagaActions.ONBOARD_RIDER}_${SagaActionType.REQUEST}`,
    onboardRiderSaga
  );
}

export default onboardRiderWatcher;
