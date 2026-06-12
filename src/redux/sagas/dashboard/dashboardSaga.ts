import { call, put, takeEvery } from "redux-saga/effects";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { API_ENDPOINTS, apiRequest } from "../../../config/api.config";
import { getAuthToken } from "../../../utils/auth";

function* fetchDashboardSaga(): Generator<any, void, any> {
  yield put({ type: `${SagaActions.GET}_${SagaActions.ADMIN_DASHBOARD}` });

  try {
    const token = getAuthToken();
    const response = yield call(apiRequest, API_ENDPOINTS.ADMIN.DASHBOARD, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_DASHBOARD}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_DASHBOARD}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to fetch dashboard",
    });
  }
}

export function* dashboardWatcher() {
  yield takeEvery(
    `${SagaActions.GET}_${SagaActions.ADMIN_DASHBOARD}_${SagaActionType.REQUEST}`,
    fetchDashboardSaga
  );
}

export default dashboardWatcher;
