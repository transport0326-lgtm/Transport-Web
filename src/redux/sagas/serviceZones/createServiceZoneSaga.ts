// sagas/createServiceZoneSaga.ts
import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { getAuthToken } from "../../../utils/auth";

function* createServiceZoneSaga(action: {
  type: string;
  payload: {
    name: string;
    city: string;
    state: string;
    areaCoverage: number;
    isActive: boolean;
  };
}): Generator<any, void, any> {
  yield put({
    type: `${SagaActions.POST}_${SagaActions.ADMIN_SERVICE_ZONES}`,
  });

  try {
    const token = getAuthToken();

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.SERVICE_ZONES}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(action.payload),
      },
    );

    yield put({
      type: `${SagaActions.POST}_${SagaActions.ADMIN_SERVICE_ZONES}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
    yield put({
      type: `${SagaActions.GET}_${SagaActions.ZONE_SETTINGS}_${SagaActionType.REQUEST}`,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.POST}_${SagaActions.ADMIN_SERVICE_ZONES}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to create service zone",
    });
  }
}

export function* createServiceZoneWatcher() {
  yield takeLatest(
    `${SagaActions.POST}_${SagaActions.ADMIN_SERVICE_ZONES}_${SagaActionType.REQUEST}`,
    createServiceZoneSaga,
  );
}

export default createServiceZoneWatcher;
