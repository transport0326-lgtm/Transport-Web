import { call, put, takeLatest } from "redux-saga/effects";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { API_ENDPOINTS, apiRequest } from "../../../config/api.config";
import type { ResolveConversationPayload } from "./resolveConversationAction";
import { getAuthToken } from "../../../utils/auth";

function* resolveConversationSaga(
  action: { type: string; payload: ResolveConversationPayload }
): Generator<any, void, any> {
  try {
    const token = getAuthToken();
    const { conversationId, onSuccess } = action.payload;

    yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.SUPPORT_CONVERSATIONS}/${conversationId}/resolve`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.ADMIN_RESOLVE_CONVERSATION}_${SagaActionType.SUCCESS}`,
      payload: { conversationId },
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
      type: `${SagaActions.PATCH}_${SagaActions.ADMIN_RESOLVE_CONVERSATION}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to resolve conversation",
    });
    action.payload.onError?.();
  }
}

export function* resolveConversationWatcher() {
  yield takeLatest(
    `${SagaActions.PATCH}_${SagaActions.ADMIN_RESOLVE_CONVERSATION}_${SagaActionType.REQUEST}`,
    resolveConversationSaga
  );
}

export default resolveConversationWatcher;