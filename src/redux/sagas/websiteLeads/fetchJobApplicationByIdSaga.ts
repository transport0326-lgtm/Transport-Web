import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import type { FetchJobApplicationByIdPayload } from "./fetchJobApplicationByIdAction";

function* fetchJobApplicationByIdSaga(action: {
  type: string;
  payload: FetchJobApplicationByIdPayload;
}): Generator<any, void, any> {
  yield put({ type: `${SagaActions.GET}_${SagaActions.ADMIN_JOB_APPLICATION_DETAIL}` });

  try {
    const token = localStorage.getItem("token");
    const { id } = action.payload;

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.JOB_APPLICATIONS}/${id}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_JOB_APPLICATION_DETAIL}_${SagaActionType.SUCCESS}`,
      payload: response?.jobApplication ?? response,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_JOB_APPLICATION_DETAIL}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to fetch job application",
    });
  }
}

export function* fetchJobApplicationByIdWatcher() {
  yield takeLatest(
    `${SagaActions.GET}_${SagaActions.ADMIN_JOB_APPLICATION_DETAIL}_${SagaActionType.REQUEST}`,
    fetchJobApplicationByIdSaga,
  );
}

export default fetchJobApplicationByIdWatcher;
