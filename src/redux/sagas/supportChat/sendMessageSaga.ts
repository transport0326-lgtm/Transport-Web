import { call, put, takeLatest } from "redux-saga/effects";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { API_ENDPOINTS, apiRequest } from "../../../config/api.config";
import type { SendMessagePayload } from "./sendMessageAction";
import { getAuthToken } from "../../../utils/auth";

function* sendMessageSaga(
  action: { type: string; payload: SendMessagePayload }
): Generator<any, void, any> { // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    const token = getAuthToken();
    const { conversationId, text } = action.payload;

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.SUPPORT_CONVERSATIONS}/${conversationId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      }
    );

    yield put({
      type: `${SagaActions.POST}_${SagaActions.ADMIN_SEND_MESSAGE}_${SagaActionType.SUCCESS}`,
      payload: response,
    });

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_CONVERSATION_MESSAGES}_${SagaActionType.REQUEST}`,
      payload: { conversationId },
    });

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_SUPPORT_CONVERSATIONS}_${SagaActionType.REQUEST}`,
      payload: {},
    });
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    yield put({
      type: `${SagaActions.POST}_${SagaActions.ADMIN_SEND_MESSAGE}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to send message",
    });
  }
}

export function* sendMessageWatcher() {
  yield takeLatest(
    `${SagaActions.POST}_${SagaActions.ADMIN_SEND_MESSAGE}_${SagaActionType.REQUEST}`,
    sendMessageSaga
  );
}

export default sendMessageWatcher;
