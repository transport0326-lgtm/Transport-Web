import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { getAuthToken } from "../../../utils/auth";

function* fetchAlertsCountSaga(): Generator<any, void, any> {
  yield put({
    type: `${SagaActions.GET}_${SagaActions.ADMIN_ALERTS_COUNT}`,
  });

  try {
    const token = getAuthToken();

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.ALERTS_COUNT}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_ALERTS_COUNT}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_ALERTS_COUNT}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to fetch alerts count",
    });
  }
}

export function* fetchAlertsCountWatcher() {
  yield takeLatest(
    `${SagaActions.GET}_${SagaActions.ADMIN_ALERTS_COUNT}_${SagaActionType.REQUEST}`,
    fetchAlertsCountSaga
  );
}

export default fetchAlertsCountWatcher;
