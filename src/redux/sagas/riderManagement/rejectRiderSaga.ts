// sagas/rejectRiderSaga.ts
import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { getAuthToken } from "../../../utils/auth";

function* rejectRiderSaga(action: {
  type: string;
  payload: {
    riderId: string;
    rejectionReason?: string;
  };
}): Generator<any, void, any> {
  yield put({
    type: `${SagaActions.PATCH}_${SagaActions.REJECT_RIDER}`,
  });

  try {
    const token = getAuthToken();
    const { riderId, rejectionReason } = action.payload;

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.RIDER_MANAGEMENT}/${riderId}/reject`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: rejectionReason ?? "" }),
      }
    );

    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.REJECT_RIDER}_${SagaActionType.SUCCESS}`,
      payload: response,
    });

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_RIDER_DETAIL}_${SagaActionType.REQUEST}`,
      payload: { riderId },
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.REJECT_RIDER}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to reject partner",
    });
  }
}

export function* rejectRiderWatcher() {
  yield takeLatest(
    `${SagaActions.PATCH}_${SagaActions.REJECT_RIDER}_${SagaActionType.REQUEST}`,
    rejectRiderSaga
  );
}

export default rejectRiderWatcher;