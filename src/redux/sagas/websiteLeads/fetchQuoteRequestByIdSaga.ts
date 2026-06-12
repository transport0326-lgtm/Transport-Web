import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import type { FetchQuoteRequestByIdPayload } from "./fetchQuoteRequestByIdAction";

function* fetchQuoteRequestByIdSaga(action: {
  type: string;
  payload: FetchQuoteRequestByIdPayload;
}): Generator<any, void, any> {
  yield put({ type: `${SagaActions.GET}_${SagaActions.ADMIN_QUOTE_REQUEST_DETAIL}` });

  try {
    const token = localStorage.getItem("token");
    const { id } = action.payload;

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.QUOTE_REQUESTS}/${id}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_QUOTE_REQUEST_DETAIL}_${SagaActionType.SUCCESS}`,
      payload: response?.quoteRequest ?? response,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_QUOTE_REQUEST_DETAIL}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to fetch quote request",
    });
  }
}

export function* fetchQuoteRequestByIdWatcher() {
  yield takeLatest(
    `${SagaActions.GET}_${SagaActions.ADMIN_QUOTE_REQUEST_DETAIL}_${SagaActionType.REQUEST}`,
    fetchQuoteRequestByIdSaga,
  );
}

export default fetchQuoteRequestByIdWatcher;
