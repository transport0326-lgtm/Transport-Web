import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { getAuthToken } from "../../../utils/auth";

function* updateZoneConfigSaga(action: {
  type: string;
  payload: {
    defaultRadiusKm: number;
    overlapAllowed: boolean;
    autoExpandOnHighDemand: boolean;
  };
}): Generator<any, void, any> {
  yield put({
    type: `${SagaActions.PATCH}_${SagaActions.ADMIN_ZONE_CONFIG}`,
  });

  try {
    const token = getAuthToken();

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.ZONE_CONFIG}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(action.payload),
      }
    );

    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.ADMIN_ZONE_CONFIG}_${SagaActionType.SUCCESS}`,
      payload: response,
    });

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_ZONE_CONFIG}_${SagaActionType.REQUEST}`,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.ADMIN_ZONE_CONFIG}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to update zone config",
    });
  }
}

export function* updateZoneConfigWatcher() {
  yield takeLatest(
    `${SagaActions.PATCH}_${SagaActions.ADMIN_ZONE_CONFIG}_${SagaActionType.REQUEST}`,
    updateZoneConfigSaga
  );
}

export default updateZoneConfigWatcher;