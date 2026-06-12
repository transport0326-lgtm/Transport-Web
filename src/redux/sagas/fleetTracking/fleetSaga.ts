import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { getAuthToken } from "../../../utils/auth";

function* fetchFleetSaga(action: {
  type: string;
  payload?: {
    filter?: 'active' | 'idle' | 'offline';
    search?: string;
  };
}): Generator<any, void, any> {
  yield put({
    type: `${SagaActions.GET}_${SagaActions.ADMIN_FLEET}`,
  });

  try {
    const token = getAuthToken();

    // query params build karo
    const params = new URLSearchParams();
    if (action.payload?.filter) params.append('filter', action.payload.filter);
    if (action.payload?.search) params.append('search', action.payload.search);
    const queryString = params.toString();
    const url = queryString
      ? `${API_ENDPOINTS.ADMIN.FLEET}?${queryString}`
      : `${API_ENDPOINTS.ADMIN.FLEET}`;

    const response = yield call(
      apiRequest,
      url,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_FLEET}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_FLEET}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to fetch fleet",
    });
  }
}

export function* fetchFleetWatcher() {
  yield takeLatest(
    `${SagaActions.GET}_${SagaActions.ADMIN_FLEET}_${SagaActionType.REQUEST}`,
    fetchFleetSaga
  );
}

export default fetchFleetWatcher;