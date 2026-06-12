import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import type { FetchContactMessageByIdPayload } from "./fetchContactMessageByIdAction";

function* fetchContactMessageByIdSaga(action: {
  type: string;
  payload: FetchContactMessageByIdPayload;
}): Generator<any, void, any> {
  yield put({ type: `${SagaActions.GET}_${SagaActions.ADMIN_CONTACT_MESSAGE_DETAIL}` });

  try {
    const token = localStorage.getItem("token");
    const { id } = action.payload;

    // Fetching a contact message auto-marks it as read on the backend
    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.CONTACT_MESSAGES}/${id}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_CONTACT_MESSAGE_DETAIL}_${SagaActionType.SUCCESS}`,
      payload: response?.contactMessage ?? response,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_CONTACT_MESSAGE_DETAIL}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to fetch contact message",
    });
  }
}

export function* fetchContactMessageByIdWatcher() {
  yield takeLatest(
    `${SagaActions.GET}_${SagaActions.ADMIN_CONTACT_MESSAGE_DETAIL}_${SagaActionType.REQUEST}`,
    fetchContactMessageByIdSaga,
  );
}

export default fetchContactMessageByIdWatcher;
