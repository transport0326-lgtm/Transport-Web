import { call, put, takeLatest } from "redux-saga/effects";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { API_ENDPOINTS, apiRequest } from "../../../config/api.config";
import { getAuthToken } from "../../../utils/auth";

function* fetchBillingSaga(): Generator<any, void, any> {
  yield put({ type: `${SagaActions.GET}_${SagaActions.ADMIN_BILLING}` });
  try {
    const token = getAuthToken();

    const response = yield call(
      apiRequest,
      API_ENDPOINTS.ADMIN.BILLING,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_BILLING}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_BILLING}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to fetch billing data",
    });
  }
}

export function* fetchBillingWatcher() {
  yield takeLatest(
    `${SagaActions.GET}_${SagaActions.ADMIN_BILLING}_${SagaActionType.REQUEST}`,
    fetchBillingSaga
  );
}

export default fetchBillingWatcher;