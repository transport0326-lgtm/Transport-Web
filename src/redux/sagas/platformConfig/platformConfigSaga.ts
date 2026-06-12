import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { getAuthToken } from "../../../utils/auth";

function* fetchPlatformConfigSaga(): Generator<any, void, any> {
  yield put({
    type: `${SagaActions.GET}_${SagaActions.ADMIN_PLATFORM_CONFIG}`,
  });

  try {
    const token = getAuthToken();

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.PLATFORM_CONFIG}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_PLATFORM_CONFIG}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_PLATFORM_CONFIG}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to fetch platform config",
    });
  }
}

function* updatePlatformConfigSaga(action: {
  type: string;
  payload: {
    platformCommissionPct: number;
    gstPct: number;
    onSuccess?: () => void;
    onError?: () => void;
  };
}): Generator<any, void, any> {
  yield put({
    type: `${SagaActions.PATCH}_${SagaActions.ADMIN_UPDATE_PLATFORM_CONFIG}`,
  });

  try {
    const token = getAuthToken();
    const { platformCommissionPct, gstPct, onSuccess } = action.payload;

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.PLATFORM_CONFIG}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ platformCommissionPct, gstPct }),
      }
    );

    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.ADMIN_UPDATE_PLATFORM_CONFIG}_${SagaActionType.SUCCESS}`,
      payload: response,
    });

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_PLATFORM_CONFIG}_${SagaActionType.REQUEST}`,
    });

    if (onSuccess) onSuccess();
  } catch (error: any) {
    const { onError } = action.payload;

    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.ADMIN_UPDATE_PLATFORM_CONFIG}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to update platform config",
    });

    if (onError) onError();
  }
}

export function* fetchPlatformConfigWatcher() {
  yield takeLatest(
    `${SagaActions.GET}_${SagaActions.ADMIN_PLATFORM_CONFIG}_${SagaActionType.REQUEST}`,
    fetchPlatformConfigSaga
  );
}

export function* updatePlatformConfigWatcher() {
  yield takeLatest(
    `${SagaActions.PATCH}_${SagaActions.ADMIN_UPDATE_PLATFORM_CONFIG}_${SagaActionType.REQUEST}`,
    updatePlatformConfigSaga
  );
}
