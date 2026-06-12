import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { getAuthToken } from "../../../utils/auth";

function* toggleSurgeRuleSaga(action: {
  type: string;
  payload: {
    vehicleType: "bike" | "auto" | "miniTruck" | "truck";
    ruleId: string;
    onSuccess?: () => void;
    onError?: () => void;
  };
}): Generator<any, void, any> {
  yield put({
    type: `${SagaActions.PATCH}_${SagaActions.ADMIN_TOGGLE_SURGE_RULE}`,
  });

  try {
    const token = getAuthToken();
    const { vehicleType, ruleId, onSuccess } = action.payload;

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.SETTINGS_PRICING}/${vehicleType}/surge-rules/${ruleId}/toggle`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.ADMIN_TOGGLE_SURGE_RULE}_${SagaActionType.SUCCESS}`,
      payload: { vehicleType, ruleId, ...response },
    });

    yield put({
      type: `${SagaActions.GET}_${SagaActions.PRICING_SETTINGS}_${SagaActionType.REQUEST}`,
    });

    if (onSuccess) onSuccess();
  } catch (error: any) {
    const { onError } = action.payload;

    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.ADMIN_TOGGLE_SURGE_RULE}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to toggle surge rule",
    });

    if (onError) onError();
  }
}

export function* toggleSurgeRuleWatcher() {
  yield takeLatest(
    `${SagaActions.PATCH}_${SagaActions.ADMIN_TOGGLE_SURGE_RULE}_${SagaActionType.REQUEST}`,
    toggleSurgeRuleSaga
  );
}

export default toggleSurgeRuleWatcher;
