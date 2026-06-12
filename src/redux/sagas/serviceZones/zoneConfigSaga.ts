import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { getAuthToken } from "../../../utils/auth";

function* fetchZoneConfigSaga(): Generator<any, void, any> {
  yield put({
    type: `${SagaActions.GET}_${SagaActions.ADMIN_ZONE_CONFIG}`,
  });

  try {
    const token = getAuthToken();

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.ZONE_CONFIG}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_ZONE_CONFIG}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_ZONE_CONFIG}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to fetch zone config",
    });
  }
}

export function* fetchZoneConfigWatcher() {
  yield takeLatest(
    `${SagaActions.GET}_${SagaActions.ADMIN_ZONE_CONFIG}_${SagaActionType.REQUEST}`,
    fetchZoneConfigSaga
  );
}

export default fetchZoneConfigWatcher;