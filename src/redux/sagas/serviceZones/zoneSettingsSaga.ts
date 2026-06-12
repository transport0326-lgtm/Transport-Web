import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { getAuthToken } from "../../../utils/auth";

function* fetchZoneSettingsSaga(): Generator<any, void, any> {
  yield put({
    type: `${SagaActions.GET}_${SagaActions.ZONE_SETTINGS}`,
  });

  try {
    const token = getAuthToken();

    if (!token) {
      yield put({
        type: `${SagaActions.GET}_${SagaActions.ZONE_SETTINGS}_${SagaActionType.FAIL}`,
        payload: "Unauthorized: no auth token found",
      });
      return;
    }

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.ZONE_SETTINGS}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ZONE_SETTINGS}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.GET}_${SagaActions.ZONE_SETTINGS}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to fetch zone settings",
    });
  }
}

export function* fetchZoneSettingsWatcher() {
  yield takeLatest(
    `${SagaActions.GET}_${SagaActions.ZONE_SETTINGS}_${SagaActionType.REQUEST}`,
    fetchZoneSettingsSaga
  );
}

export default fetchZoneSettingsWatcher;