import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { getAuthToken } from "../../../utils/auth";

function* fetchRiderManagementSaga(action: {
  type: string;
  payload: {
    tab: "pending" | "approved" | "rejected" | "suspended";
    search?: string;
    vehicleType?: string;
    page?: number;
    limit?: number;
  };
}): Generator<any, void, any> {
  yield put({ type: `${SagaActions.GET}_${SagaActions.ADMIN_RIDER_MANAGEMENT}` });

  try {
    const token = getAuthToken();
    const { tab, search, vehicleType, page, limit } = action.payload;

    const params = new URLSearchParams({ tab });
    if (search) params.set("search", search);
    if (vehicleType && vehicleType !== "all") params.set("vehicleType", vehicleType);
    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.RIDER_MANAGEMENT}?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_RIDER_MANAGEMENT}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_RIDER_MANAGEMENT}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to fetch rider management",
    });
  }
}

export function* riderManagementWatcher() {
  yield takeLatest(
    `${SagaActions.GET}_${SagaActions.ADMIN_RIDER_MANAGEMENT}_${SagaActionType.REQUEST}`,
    fetchRiderManagementSaga
  );
}

export default riderManagementWatcher;