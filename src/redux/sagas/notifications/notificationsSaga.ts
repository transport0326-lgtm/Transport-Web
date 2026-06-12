import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { getAuthToken } from "../../../utils/auth";

function* fetchNotificationsSaga(): Generator<any, void, any> {
  yield put({
    type: `${SagaActions.GET}_${SagaActions.ADMIN_NOTIFICATIONS}`,
  });

  try {
    const token = getAuthToken();

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.NOTIFICATIONS}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_NOTIFICATIONS}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_NOTIFICATIONS}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to fetch notifications",
    });
  }
}

export function* fetchNotificationsWatcher() {
  yield takeLatest(
    `${SagaActions.GET}_${SagaActions.ADMIN_NOTIFICATIONS}_${SagaActionType.REQUEST}`,
    fetchNotificationsSaga
  );
}

export default fetchNotificationsWatcher;