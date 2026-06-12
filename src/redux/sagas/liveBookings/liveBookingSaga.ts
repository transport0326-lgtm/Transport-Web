import { call, put, takeLatest } from "redux-saga/effects";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { API_ENDPOINTS, apiRequest } from "../../../config/api.config";
import { getAuthToken } from "../../../utils/auth";

function* fetchLiveBookingsSaga(action: any): Generator<any, void, any> { // eslint-disable-line @typescript-eslint/no-explicit-any
  yield put({ type: `${SagaActions.GET}_${SagaActions.ADMIN_LIVE_BOOKINGS}` });

  try {
    const token = getAuthToken();
    const { status, search, page, limit } = action.payload ?? {};

    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (search) params.set("search", search);
    if (page)  params.set("page", String(page));
    if (limit) params.set("limit", String(limit));
    const qs = params.toString();
    const endpoint = qs
      ? `${API_ENDPOINTS.ADMIN.LIVE_BOOKINGS}?${qs}`
      : API_ENDPOINTS.ADMIN.LIVE_BOOKINGS;

    const response = yield call(apiRequest, endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_LIVE_BOOKINGS}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_LIVE_BOOKINGS}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to fetch live bookings",
    });
  }
}

export function* liveBookingsWatcher() {
  yield takeLatest(
    `${SagaActions.GET}_${SagaActions.ADMIN_LIVE_BOOKINGS}_${SagaActionType.REQUEST}`,
    fetchLiveBookingsSaga
  );
}

export default liveBookingsWatcher;