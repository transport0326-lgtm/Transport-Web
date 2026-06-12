import { call, put, takeLatest } from "redux-saga/effects";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { API_ENDPOINTS, apiRequest } from "../../../config/api.config";
import type { FetchSupportConversationsPayload } from "./fetchSupportConversationsAction";
import { getAuthToken } from "../../../utils/auth";

function* fetchSupportConversationsSaga(
  action: { type: string; payload: FetchSupportConversationsPayload }
): Generator<any, void, any> {
  yield put({ type: `${SagaActions.GET}_${SagaActions.ADMIN_SUPPORT_CONVERSATIONS}` });

  try {
    const token = getAuthToken();
    const { status, type } = action.payload;

    // query params build karo
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (type) params.append("type", type);
    const query = params.toString() ? `?${params.toString()}` : "";

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.SUPPORT_CONVERSATIONS}${query}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_SUPPORT_CONVERSATIONS}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_SUPPORT_CONVERSATIONS}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to fetch conversations",
    });
  }
}

export function* fetchSupportConversationsWatcher() {
  yield takeLatest(
    `${SagaActions.GET}_${SagaActions.ADMIN_SUPPORT_CONVERSATIONS}_${SagaActionType.REQUEST}`,
    fetchSupportConversationsSaga
  );
}

export default fetchSupportConversationsWatcher;