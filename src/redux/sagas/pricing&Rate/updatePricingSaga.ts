import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { getAuthToken } from "../../../utils/auth";

function* updatePricingSaga(action: {
  type: string;
  payload: {
    vehicleType: "bike" | "auto" | "miniTruck" | "truck";
    baseFare: number;
    baseKmIncluded?: number;
    perKmRate: number;
    perMinRate?: number;
    minFare?: number;
    rate0to10?: number;
    rate10to25?: number;
    rate25plus?: number;
    surgeEnabled?: boolean;
    maxSurgeCap?: number;
    onSuccess?: () => void;
    onError?: () => void;
  };
}): Generator<any, void, any> {
  yield put({
    type: `${SagaActions.PATCH}_${SagaActions.ADMIN_SETTINGS_PRICING}`,
  });

  try {
    const token = getAuthToken();
    const {
      vehicleType,
      baseFare,
      baseKmIncluded,
      perKmRate,
      perMinRate,
      minFare,
      rate0to10,
      rate10to25,
      rate25plus,
      surgeEnabled,
      maxSurgeCap,
      onSuccess,
    } = action.payload;

    const body: Record<string, unknown> = { baseFare, perKmRate };
    if (baseKmIncluded !== undefined) body.baseKmIncluded = baseKmIncluded;
    if (perMinRate !== undefined) body.perMinRate = perMinRate;
    if (minFare !== undefined) body.minFare = minFare;
    if (rate0to10 !== undefined) body.rate0to10 = rate0to10;
    if (rate10to25 !== undefined) body.rate10to25 = rate10to25;
    if (rate25plus !== undefined) body.rate25plus = rate25plus;
    if (surgeEnabled !== undefined) body.surgeEnabled = surgeEnabled;
    if (maxSurgeCap !== undefined) body.maxSurgeCap = maxSurgeCap;

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.SETTINGS_PRICING}/${vehicleType}`,
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
      type: `${SagaActions.PATCH}_${SagaActions.ADMIN_SETTINGS_PRICING}_${SagaActionType.SUCCESS}`,
      payload: { vehicleType, ...response },
    });

    yield put({
      type: `${SagaActions.GET}_${SagaActions.PRICING_SETTINGS}_${SagaActionType.REQUEST}`,
    });

    if (onSuccess) onSuccess(); // ✅ edit view band hoga, list par wapas aayega
  } catch (error: any) {
    const { onError } = action.payload;

    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.ADMIN_SETTINGS_PRICING}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to update pricing",
    });

    if (onError) onError();
  }
}

export function* updatePricingWatcher() {
  yield takeLatest(
    `${SagaActions.PATCH}_${SagaActions.ADMIN_SETTINGS_PRICING}_${SagaActionType.REQUEST}`,
    updatePricingSaga
  );
}

export default updatePricingWatcher;