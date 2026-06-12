import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { getAuthToken } from "../../../utils/auth";

function* fetchSupportCountSaga(): Generator<any, void, any> {
  yield put({
    type: `${SagaActions.GET}_${SagaActions.ADMIN_SUPPORT_COUNT}`,
  });

  try {
    const token = getAuthToken();

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.SUPPORT_COUNT}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_SUPPORT_COUNT}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_SUPPORT_COUNT}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to fetch support count",
    });
  }
}

export function* fetchSupportCountWatcher() {
  yield takeLatest(
    `${SagaActions.GET}_${SagaActions.ADMIN_SUPPORT_COUNT}_${SagaActionType.REQUEST}`,
    fetchSupportCountSaga
  );
}

export default fetchSupportCountWatcher;
