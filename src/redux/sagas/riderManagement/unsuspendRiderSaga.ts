import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { getAuthToken } from "../../../utils/auth";

function* unsuspendRiderSaga(action: {
  type: string;
  payload: { riderId: string };
}): Generator<any, void, any> {
  yield put({ type: `${SagaActions.PATCH}_${SagaActions.UNSUSPEND_RIDER}` });

  try {
    const token = getAuthToken();
    const { riderId } = action.payload;

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.RIDER_MANAGEMENT}/${riderId}/unsuspend`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.UNSUSPEND_RIDER}_${SagaActionType.SUCCESS}`,
      payload: response,
    });

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_RIDER_DETAIL}_${SagaActionType.REQUEST}`,
      payload: { riderId },
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.UNSUSPEND_RIDER}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to unsuspend partner",
    });
  }
}

export function* unsuspendRiderWatcher() {
  yield takeLatest(
    `${SagaActions.PATCH}_${SagaActions.UNSUSPEND_RIDER}_${SagaActionType.REQUEST}`,
    unsuspendRiderSaga
  );
}

export default unsuspendRiderWatcher;
