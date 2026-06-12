import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import type { FetchQuoteRequestsPayload } from "./quoteRequestsAction";

function* fetchQuoteRequestsSaga(action: {
  type: string;
  payload: FetchQuoteRequestsPayload;
}): Generator<any, void, any> {
  yield put({ type: `${SagaActions.GET}_${SagaActions.ADMIN_QUOTE_REQUESTS}` });

  try {
    const token = localStorage.getItem("token");
    const { status, page, limit } = action.payload ?? {};

    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));
    const query = params.toString() ? `?${params.toString()}` : "";

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.QUOTE_REQUESTS}${query}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_QUOTE_REQUESTS}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_QUOTE_REQUESTS}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to fetch quote requests",
    });
  }
}

export function* quoteRequestsWatcher() {
  yield takeLatest(
    `${SagaActions.GET}_${SagaActions.ADMIN_QUOTE_REQUESTS}_${SagaActionType.REQUEST}`,
    fetchQuoteRequestsSaga,
  );
}

export default quoteRequestsWatcher;
