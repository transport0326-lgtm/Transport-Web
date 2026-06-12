import { call, put, takeLatest } from "redux-saga/effects";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { sendMessage } from "./sendMessageAction";
import type { UploadChatPayload } from "./uploadChatAction";
import { getAuthToken } from "../../../utils/auth";

function* uploadChatSaga(
  action: { type: string; payload: UploadChatPayload }
): Generator<any, void, any> { // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    const { conversationId, file } = action.payload;
    const token = getAuthToken();

    const isProduction = import.meta.env.MODE === "production";
    const base = isProduction
      ? (import.meta.env.VITE_API_BASE_URL || "https://api.transpport.com").replace(/\/$/, "")
      : "";
    const url = base ? `${base}/auth/upload-chat` : "/api/auth/upload-chat";

    const formData = new FormData();
    formData.append("file", file);

    const response: Response = yield call(fetch, url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
      body: formData,
    });

    const data: { success: boolean; url: string; fileType: string } = yield call(
      [response, "json"]
    );

    if (!data.success) throw new Error("Upload failed");

    yield put({
      type: `${SagaActions.POST}_${SagaActions.ADMIN_UPLOAD_CHAT}_${SagaActionType.SUCCESS}`,
      payload: { url: data.url, fileType: data.fileType },
    });

    yield put(sendMessage({ conversationId, text: data.url }));
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    yield put({
      type: `${SagaActions.POST}_${SagaActions.ADMIN_UPLOAD_CHAT}_${SagaActionType.FAIL}`,
      payload: error?.message || "Upload failed",
    });
  }
}

export function* uploadChatWatcher() {
  yield takeLatest(
    `${SagaActions.POST}_${SagaActions.ADMIN_UPLOAD_CHAT}_${SagaActionType.REQUEST}`,
    uploadChatSaga
  );
}

export default uploadChatWatcher;
