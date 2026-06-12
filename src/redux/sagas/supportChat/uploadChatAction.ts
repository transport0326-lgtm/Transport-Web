import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export interface UploadChatPayload {
  conversationId: string;
  file: File;
}

export const uploadChat = createAction<UploadChatPayload>(
  `${SagaActions.POST}_${SagaActions.ADMIN_UPLOAD_CHAT}_${SagaActionType.REQUEST}`
);
