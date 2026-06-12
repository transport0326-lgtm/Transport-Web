// sagas/updateRiderDocumentSaga.ts
import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { getAuthToken } from "../../../utils/auth";

function* updateRiderDocumentSaga(action: {
  type: string;
  payload: {
    riderId: string;
    docType: string;
    status: string;
  };
}): Generator<any, void, any> {
  yield put({
    type: `${SagaActions.PATCH}_${SagaActions.ADMIN_RIDER_DOCUMENT}`,
  });

  try {
    const token = getAuthToken();
    const { riderId, docType, status } = action.payload;

    yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.RIDER_MANAGEMENT}/${riderId}/document`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ docType, status }),
      }
    );

    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.ADMIN_RIDER_DOCUMENT}_${SagaActionType.SUCCESS}`,
      payload: { docType, status },
    });

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_RIDER_DETAIL}_${SagaActionType.REQUEST}`,
      payload: { riderId },
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.ADMIN_RIDER_DOCUMENT}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to update rider document",
    });
  }
}

export function* updateRiderDocumentWatcher() {
  yield takeLatest(
    `${SagaActions.PATCH}_${SagaActions.ADMIN_RIDER_DOCUMENT}_${SagaActionType.REQUEST}`,
    updateRiderDocumentSaga
  );
}

export default updateRiderDocumentWatcher;