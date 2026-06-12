import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { getAuthToken } from "../../../utils/auth";
import type { UpdateSurgeRulePayload } from "./updateSurgeRuleAction";

function* updateSurgeRuleSaga(action: {
  type: string;
  payload: UpdateSurgeRulePayload;
}): Generator<any, void, any> {
  yield put({
    type: `${SagaActions.PATCH}_${SagaActions.ADMIN_UPDATE_SURGE_RULE}`,
  });

  try {
    const token = getAuthToken();
    const {
      vehicleType,
      ruleId,
      name,
      multiplier,
      maxFareCap,
      schedule,
      onSuccess,
    } = action.payload;

    const body: Record<string, any> = { name, multiplier }; // eslint-disable-line @typescript-eslint/no-explicit-any
    if (maxFareCap != null) body.maxFareCap = maxFareCap;
    if (schedule) body.schedule = schedule;

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.SETTINGS_PRICING}/${vehicleType}/surge-rules/${ruleId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.ADMIN_UPDATE_SURGE_RULE}_${SagaActionType.SUCCESS}`,
      payload: { vehicleType, ruleId, ...response },
    });

    yield put({
      type: `${SagaActions.GET}_${SagaActions.PRICING_SETTINGS}_${SagaActionType.REQUEST}`,
    });

    if (onSuccess) onSuccess();
  } catch (error: any) {
    const { onError } = action.payload;

    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.ADMIN_UPDATE_SURGE_RULE}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to update surge rule",
    });

    if (onError) onError();
  }
}

export function* updateSurgeRuleWatcher() {
  yield takeLatest(
    `${SagaActions.PATCH}_${SagaActions.ADMIN_UPDATE_SURGE_RULE}_${SagaActionType.REQUEST}`,
    updateSurgeRuleSaga
  );
}

export default updateSurgeRuleWatcher;
