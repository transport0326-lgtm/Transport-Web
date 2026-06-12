import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { getAuthToken } from "../../../utils/auth";

function* assignRiderZoneSaga(action: {
  type: string;
  payload: {
    riderId: string;
    zoneId: string;
  };
}): Generator<any, void, any> {
  yield put({
    type: `${SagaActions.PATCH}_${SagaActions.ADMIN_ZONES_ASSIGN_RIDER}`,
  });

  try {
    const token = getAuthToken();
    const { riderId, zoneId } = action.payload;

    const response = yield call(
      apiRequest,
      API_ENDPOINTS.ADMIN.ZONES_ASSIGN_RIDER,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ riderId, zoneId }),
      }
    );

    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.ADMIN_ZONES_ASSIGN_RIDER}_${SagaActionType.SUCCESS}`,
      payload: response,
    });

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ZONE_SETTINGS}_${SagaActionType.REQUEST}`,
    });

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_RIDER_DETAIL}_${SagaActionType.REQUEST}`,
      payload: { riderId },
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.ADMIN_ZONES_ASSIGN_RIDER}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to assign rider to zone",
    });
  }
}

export function* assignRiderZoneWatcher() {
  yield takeLatest(
    `${SagaActions.PATCH}_${SagaActions.ADMIN_ZONES_ASSIGN_RIDER}_${SagaActionType.REQUEST}`,
    assignRiderZoneSaga
  );
}

export default assignRiderZoneWatcher;