import { call, put, takeLatest } from "redux-saga/effects";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { API_ENDPOINTS, apiRequest } from "../../../config/api.config";
import { getAuthToken } from "../../../utils/auth";

function* updateZoneSaga(action: { type: string; payload: { id: string; data: Record<string, any> } }): Generator<any, void, any> {
  yield put({ type: `${SagaActions.PATCH}_${SagaActions.ADMIN_ZONE}` });

  try {
    const token = getAuthToken();
    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.ZONE}/${action.payload.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(action.payload.data),
      }
    );

    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.ADMIN_ZONE}_${SagaActionType.SUCCESS}`,
      payload: response,
    });

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ZONE_SETTINGS}_${SagaActionType.REQUEST}`,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.ADMIN_ZONE}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to update zone",
    });
  }
}

export function* updateZoneWatcher() {
  yield takeLatest(
    `${SagaActions.PATCH}_${SagaActions.ADMIN_ZONE}_${SagaActionType.REQUEST}`,
    updateZoneSaga
  );
}

export default updateZoneWatcher;