import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { getAuthToken } from "../../../utils/auth";

function* updateCompanyProfileSaga(action: {
  type: string;
  payload: {
    companyName: string;
    contactEmail: string;
    phoneNumber: string;
    businessAddress: string;
    gstNumber: string;
    defaultCurrency: string;
  };
}): Generator<any, void, any> {
  yield put({
    type: `${SagaActions.PATCH}_${SagaActions.COMPANY_PROFILE}`,
  });

  try {
    const token = getAuthToken();

    const response = yield call(
      apiRequest,
      `${API_ENDPOINTS.ADMIN.COMPANY_PROFILE}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(action.payload),
      }
    );

    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.COMPANY_PROFILE}_${SagaActionType.SUCCESS}`,
      payload: response,
    });

    yield put({
      type: `${SagaActions.GET}_${SagaActions.COMPANY_PROFILE}_${SagaActionType.REQUEST}`,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.COMPANY_PROFILE}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to update company profile",
    });
  }
}

export function* updateCompanyProfileWatcher() {
  yield takeLatest(
    `${SagaActions.PATCH}_${SagaActions.COMPANY_PROFILE}_${SagaActionType.REQUEST}`,
    updateCompanyProfileSaga
  );
}

export default updateCompanyProfileWatcher;