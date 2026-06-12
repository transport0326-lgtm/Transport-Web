// sagas/fetchReportsSaga.ts
import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { getAuthToken } from "../../../utils/auth";

function* fetchReportsSaga(): Generator<any, void, any> {
  yield put({
    type: `${SagaActions.GET}_${SagaActions.ADMIN_REPORTS}`,
  });

  try {
    const token = getAuthToken();

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.REPORTS}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_REPORTS}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_REPORTS}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to fetch reports",
    });
  }
}

export function* fetchReportsWatcher() {
  yield takeLatest(
    `${SagaActions.GET}_${SagaActions.ADMIN_REPORTS}_${SagaActionType.REQUEST}`,
    fetchReportsSaga
  );
}

export default fetchReportsWatcher;