import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import type { UpdateBillingPayload } from "./updateBillingAction";
import { getAuthToken } from "../../../utils/auth";

function* updateBillingSaga(action: { type: string; payload: UpdateBillingPayload }): Generator<any, void, any> {
  yield put({ type: `${SagaActions.PATCH}_${SagaActions.ADMIN_BILLING}` });

  try {
    const token = getAuthToken();
    const { id, ...fields } = action.payload;

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.BILLING_RECORD}/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      }
    );

    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.ADMIN_BILLING}_${SagaActionType.SUCCESS}`,
      payload: response,
    });

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_BILLING}_${SagaActionType.REQUEST}`,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.ADMIN_BILLING}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to update billing record",
    });
  }
}

export function* updateBillingWatcher() {
  yield takeLatest(
    `${SagaActions.PATCH}_${SagaActions.ADMIN_BILLING}_${SagaActionType.REQUEST}`,
    updateBillingSaga
  );
}

export default updateBillingWatcher;
