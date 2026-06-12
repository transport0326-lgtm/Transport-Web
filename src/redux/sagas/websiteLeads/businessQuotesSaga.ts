import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import type { FetchBusinessQuotesPayload } from "./businessQuotesAction";

function* fetchBusinessQuotesSaga(action: {
  type: string;
  payload: FetchBusinessQuotesPayload;
}): Generator<any, void, any> {
  yield put({ type: `${SagaActions.GET}_${SagaActions.ADMIN_BUSINESS_QUOTES}` });

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
      `${API_ENDPOINTS.ADMIN.BUSINESS_QUOTES}${query}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_BUSINESS_QUOTES}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_BUSINESS_QUOTES}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to fetch business quotes",
    });
  }
}

export function* businessQuotesWatcher() {
  yield takeLatest(
    `${SagaActions.GET}_${SagaActions.ADMIN_BUSINESS_QUOTES}_${SagaActionType.REQUEST}`,
    fetchBusinessQuotesSaga,
  );
}

export default businessQuotesWatcher;
