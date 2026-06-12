import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import type { FetchJobApplicationsPayload } from "./jobApplicationsAction";

function* fetchJobApplicationsSaga(action: {
  type: string;
  payload: FetchJobApplicationsPayload;
}): Generator<any, void, any> {
  yield put({ type: `${SagaActions.GET}_${SagaActions.ADMIN_JOB_APPLICATIONS}` });

  try {
    const token = localStorage.getItem("token");
    const { status, position, page, limit } = action.payload ?? {};

    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (position) params.set("position", position);
    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));
    const query = params.toString() ? `?${params.toString()}` : "";

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.JOB_APPLICATIONS}${query}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_JOB_APPLICATIONS}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_JOB_APPLICATIONS}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to fetch job applications",
    });
  }
}

export function* jobApplicationsWatcher() {
  yield takeLatest(
    `${SagaActions.GET}_${SagaActions.ADMIN_JOB_APPLICATIONS}_${SagaActionType.REQUEST}`,
    fetchJobApplicationsSaga,
  );
}

export default jobApplicationsWatcher;
