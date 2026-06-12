import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import type { FetchBusinessQuoteByIdPayload } from "./fetchBusinessQuoteByIdAction";

function* fetchBusinessQuoteByIdSaga(action: {
  type: string;
  payload: FetchBusinessQuoteByIdPayload;
}): Generator<any, void, any> {
  yield put({ type: `${SagaActions.GET}_${SagaActions.ADMIN_BUSINESS_QUOTE_DETAIL}` });

  try {
    const token = localStorage.getItem("token");
    const { id } = action.payload;

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.BUSINESS_QUOTES}/${id}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_BUSINESS_QUOTE_DETAIL}_${SagaActionType.SUCCESS}`,
      payload: response?.businessQuote ?? response,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_BUSINESS_QUOTE_DETAIL}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to fetch business quote",
    });
  }
}

export function* fetchBusinessQuoteByIdWatcher() {
  yield takeLatest(
    `${SagaActions.GET}_${SagaActions.ADMIN_BUSINESS_QUOTE_DETAIL}_${SagaActionType.REQUEST}`,
    fetchBusinessQuoteByIdSaga,
  );
}

export default fetchBusinessQuoteByIdWatcher;
