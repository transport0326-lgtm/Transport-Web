import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { getAuthToken } from "../../../utils/auth";

function* deleteRiderSaga(action: {
  type: string;
  payload: {
    riderId: string;
  };
}): Generator<any, void, any> {
  yield put({
    type: `${SagaActions.DELETE}_${SagaActions.ADMIN_RIDER_DETAIL}`,
  });

  try {
    const token = getAuthToken();
    const { riderId } = action.payload;

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.RIDER_MANAGEMENT}/${riderId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    yield put({
      type: `${SagaActions.DELETE}_${SagaActions.ADMIN_RIDER_DETAIL}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.DELETE}_${SagaActions.ADMIN_RIDER_DETAIL}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to delete rider",
    });
  }
}

export function* deleteRiderWatcher() {
  yield takeLatest(
    `${SagaActions.DELETE}_${SagaActions.ADMIN_RIDER_DETAIL}_${SagaActionType.REQUEST}`,
    deleteRiderSaga
  );
}

export default deleteRiderWatcher;