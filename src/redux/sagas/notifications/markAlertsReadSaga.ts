import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { getAuthToken } from "../../../utils/auth";

function* markAlertsReadSaga(action: {
  type: string;
  payload: { id: string };
}): Generator<any, void, any> {
  yield put({
    type: `${SagaActions.PATCH}_${SagaActions.ADMIN_MARK_ALERTS_READ}`,
  });

  try {
    const token = getAuthToken();
    const { id } = action.payload;

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.MARK_ALERTS_READ}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      }
    );

    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.ADMIN_MARK_ALERTS_READ}_${SagaActionType.SUCCESS}`,
      payload: response,
    });

    // Refresh count badges (alerts + support) so the sidebar updates.
    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_ALERTS_COUNT}_${SagaActionType.REQUEST}`,
    });
    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_SUPPORT_COUNT}_${SagaActionType.REQUEST}`,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.ADMIN_MARK_ALERTS_READ}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to mark alerts as read",
    });
  }
}

export function* markAlertsReadWatcher() {
  yield takeLatest(
    `${SagaActions.PATCH}_${SagaActions.ADMIN_MARK_ALERTS_READ}_${SagaActionType.REQUEST}`,
    markAlertsReadSaga
  );
}

export default markAlertsReadWatcher;
