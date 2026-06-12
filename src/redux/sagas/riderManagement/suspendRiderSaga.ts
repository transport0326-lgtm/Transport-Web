// sagas/suspendRiderSaga.ts
import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { getAuthToken } from "../../../utils/auth";

function* suspendRiderSaga(action: {
  type: string;
  payload: {
    riderId: string;
    reason: string;
    duration: string;
    notes?: string;
  };
}): Generator<any, void, any> {
  yield put({
    type: `${SagaActions.PATCH}_${SagaActions.SUSPEND_RIDER}`,
  });

  try {
    const token = getAuthToken();
    const { riderId, reason, duration, notes } = action.payload;

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.RIDER_MANAGEMENT}/${riderId}/suspend`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason, duration, notes }),
      }
    );

    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.SUSPEND_RIDER}_${SagaActionType.SUCCESS}`,
      payload: response,
    });

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_RIDER_DETAIL}_${SagaActionType.REQUEST}`,
      payload: { riderId },
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.SUSPEND_RIDER}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to suspend partner",
    });
  }
}

export function* suspendRiderWatcher() {
  yield takeLatest(
    `${SagaActions.PATCH}_${SagaActions.SUSPEND_RIDER}_${SagaActionType.REQUEST}`,
    suspendRiderSaga
  );
}

export default suspendRiderWatcher;