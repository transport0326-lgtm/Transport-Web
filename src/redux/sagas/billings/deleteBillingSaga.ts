import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { getAuthToken } from "../../../utils/auth";

function* deleteBillingSaga(action: { type: string; payload: { id: string } }): Generator<any, void, any> {
  yield put({ type: `${SagaActions.DELETE}_${SagaActions.ADMIN_BILLING}` });

  try {
    const token = getAuthToken();

    yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.BILLING_RECORD}/${action.payload.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    yield put({
      type: `${SagaActions.DELETE}_${SagaActions.ADMIN_BILLING}_${SagaActionType.SUCCESS}`,
      payload: { id: action.payload.id },
    });

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_BILLING}_${SagaActionType.REQUEST}`,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.DELETE}_${SagaActions.ADMIN_BILLING}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to delete billing record",
    });
  }
}

export function* deleteBillingWatcher() {
  yield takeLatest(
    `${SagaActions.DELETE}_${SagaActions.ADMIN_BILLING}_${SagaActionType.REQUEST}`,
    deleteBillingSaga
  );
}

export default deleteBillingWatcher;
