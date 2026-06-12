
import { call, put, takeLatest } from "redux-saga/effects";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { API_ENDPOINTS, apiRequest } from "../../../config/api.config";
import type { CreateZonePayload } from "./createZoneWithRiderAction";
import { getAuthToken } from "../../../utils/auth";

function* createZoneSaga(action: { type: string; payload: CreateZonePayload }): Generator<any, void, any> {
  yield put({ type: `${SagaActions.POST}_${SagaActions.ADMIN_CREATE_ZONE}` });

  try {
    const token = getAuthToken();
    const response = yield call(
      apiRequest,
      API_ENDPOINTS.ADMIN.CREATE_ZONE,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(action.payload),
      }
    );

    yield put({
      type: `${SagaActions.POST}_${SagaActions.ADMIN_CREATE_ZONE}_${SagaActionType.SUCCESS}`,
      payload: response,
    });

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ZONE_SETTINGS}_${SagaActionType.REQUEST}`,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.POST}_${SagaActions.ADMIN_CREATE_ZONE}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to create zone",
    });
  }
}

export function* createZoneWatcher() {
  yield takeLatest(
    `${SagaActions.POST}_${SagaActions.ADMIN_CREATE_ZONE}_${SagaActionType.REQUEST}`,
    createZoneSaga
  );
}

export default createZoneWatcher;