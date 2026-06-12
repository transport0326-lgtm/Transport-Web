// sagas/fetchReportsSaga.ts
import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { getAuthToken } from "../../../utils/auth";

function* fetchReportsByDateSaga(action: {
  type: string;
  payload: {
    from: string;
    to: string;
  };
}): Generator<any, void, any> {
  yield put({
    type: `${SagaActions.GET}_${SagaActions.REPORTS_BY_DATE}`,
  });

  try {
    const token = getAuthToken();
    const { from, to } = action.payload;

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.REPORTS}?from=${from}&to=${to}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    yield put({
      type: `${SagaActions.GET}_${SagaActions.REPORTS_BY_DATE}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.GET}_${SagaActions.REPORTS_BY_DATE}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to fetch reports",
    });
  }
}

export function* fetchReportsByDateWatcher() {
  yield takeLatest(
    `${SagaActions.GET}_${SagaActions.REPORTS_BY_DATE}_${SagaActionType.REQUEST}`,
    fetchReportsByDateSaga
  );
}

export default fetchReportsByDateWatcher;