import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { getAuthToken } from "../../../utils/auth";

function* toggleSurgeSaga(action: {
  type: string;
  payload: {
    vehicleType: "bike" | "auto" | "miniTruck" | "truck";
    surgeEnabled: boolean;
    onSuccess?: () => void;
    onError?: () => void;
  };
}): Generator<any, void, any> {
  yield put({
    type: `${SagaActions.PATCH}_${SagaActions.ADMIN_TOGGLE_SURGE}`,
  });

  try {
    const token = getAuthToken();
    const { vehicleType, surgeEnabled, onSuccess } = action.payload;

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.SETTINGS_PRICING}/${vehicleType}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ surgeEnabled }),
      }
    );

    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.ADMIN_TOGGLE_SURGE}_${SagaActionType.SUCCESS}`,
      payload: { vehicleType, surgeEnabled, ...response },
    });

    yield put({
      type: `${SagaActions.GET}_${SagaActions.PRICING_SETTINGS}_${SagaActionType.REQUEST}`,
    });

    if (onSuccess) onSuccess();
  } catch (error: any) {
    const { onError } = action.payload;

    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.ADMIN_TOGGLE_SURGE}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to toggle surge pricing",
    });

    if (onError) onError();
  }
}

export function* toggleSurgeWatcher() {
  yield takeLatest(
    `${SagaActions.PATCH}_${SagaActions.ADMIN_TOGGLE_SURGE}_${SagaActionType.REQUEST}`,
    toggleSurgeSaga
  );
}

export default toggleSurgeWatcher;
