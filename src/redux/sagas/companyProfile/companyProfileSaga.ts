// sagas/fetchCompanySettingsSaga.ts
import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { getAuthToken } from "../../../utils/auth";

function* fetchCompanySettingsSaga(): Generator<any, void, any> {
  yield put({
    type: `${SagaActions.GET}_${SagaActions.COMPANY_PROFILE}`,
  });

  try {
    const token = getAuthToken();

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.COMPANY_PROFILE}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    yield put({
      type: `${SagaActions.GET}_${SagaActions.COMPANY_PROFILE}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.GET}_${SagaActions.COMPANY_PROFILE}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to fetch company settings",
    });
  }
}

export function* fetchCompanySettingsWatcher() {
  yield takeLatest(
    `${SagaActions.GET}_${SagaActions.COMPANY_PROFILE}_${SagaActionType.REQUEST}`,
    fetchCompanySettingsSaga
  );
}

export default fetchCompanySettingsWatcher;