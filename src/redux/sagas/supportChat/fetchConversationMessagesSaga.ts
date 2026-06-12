import { call, put, takeLatest } from "redux-saga/effects";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { API_ENDPOINTS, apiRequest } from "../../../config/api.config";
import type { FetchConversationMessagesPayload } from "./fetchConversationMessagesAction";
import { getAuthToken } from "../../../utils/auth";

function* fetchConversationMessagesSaga(
  action: { type: string; payload: FetchConversationMessagesPayload }
): Generator<any, void, any> {
  yield put({ type: `${SagaActions.GET}_${SagaActions.ADMIN_CONVERSATION_MESSAGES}` });

  try {
    const token = getAuthToken();
    const { conversationId } = action.payload;

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.SUPPORT_CONVERSATIONS}/${conversationId}/messages`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_CONVERSATION_MESSAGES}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_CONVERSATION_MESSAGES}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to fetch messages",
    });
  }
}

export function* fetchConversationMessagesWatcher() {
  yield takeLatest(
    `${SagaActions.GET}_${SagaActions.ADMIN_CONVERSATION_MESSAGES}_${SagaActionType.REQUEST}`,
    fetchConversationMessagesSaga
  );
}

export default fetchConversationMessagesWatcher;