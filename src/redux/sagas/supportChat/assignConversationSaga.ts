import { call, put, takeLatest } from "redux-saga/effects";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { API_ENDPOINTS, apiRequest } from "../../../config/api.config";
import type { AssignConversationPayload } from "./assignConversationAction";
import { getAuthToken } from "../../../utils/auth";

function* assignConversationSaga(
  action: { type: string; payload: AssignConversationPayload }
): Generator<any, void, any> {
  try {
    const token = getAuthToken();
    const { conversationId, adminId, onSuccess } = action.payload;

    yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.SUPPORT_CONVERSATIONS}/${conversationId}/assign`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminId }),
      }
    );

    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.ADMIN_ASSIGN_CONVERSATION}_${SagaActionType.SUCCESS}`,
      payload: { conversationId, adminId },
    });

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_SUPPORT_CONVERSATIONS}_${SagaActionType.REQUEST}`,
      payload: {},
    });

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_CONVERSATION_MESSAGES}_${SagaActionType.REQUEST}`,
      payload: { conversationId },
    });

    onSuccess?.();
  } catch (error: any) {
    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.ADMIN_ASSIGN_CONVERSATION}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to assign conversation",
    });
    action.payload.onError?.();
  }
}

export function* assignConversationWatcher() {
  yield takeLatest(
    `${SagaActions.PATCH}_${SagaActions.ADMIN_ASSIGN_CONVERSATION}_${SagaActionType.REQUEST}`,
    assignConversationSaga
  );
}

export default assignConversationWatcher;