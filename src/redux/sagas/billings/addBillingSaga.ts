import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import type { AddBillingPayload } from "./addBillingAction";
import { getAuthToken } from "../../../utils/auth";

function* addBillingSaga(action: { type: string; payload: AddBillingPayload }): Generator<any, void, any> {
    yield put({
        type: `${SagaActions.ADD}_${SagaActions.ADMIN_BILLING}`,
    });

    try {
        const token = getAuthToken();

        if (!token) {
            yield put({
                type: `${SagaActions.ADD}_${SagaActions.ADMIN_BILLING}_${SagaActionType.FAIL}`,
                payload: "Unauthorized: no auth token found",
            });
            return;
        }

        const response = yield call(
            apiRequest,
            `${API_ENDPOINTS.ADMIN.BILLING}`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(action.payload),
            }
        );

        yield put({
            type: `${SagaActions.ADD}_${SagaActions.ADMIN_BILLING}_${SagaActionType.SUCCESS}`,
            payload: response,
        });

        yield put({
            type: `${SagaActions.GET}_${SagaActions.ADMIN_BILLING}_${SagaActionType.REQUEST}`,
        });
    } catch (error: any) {
        yield put({
            type: `${SagaActions.ADD}_${SagaActions.ADMIN_BILLING}_${SagaActionType.FAIL}`,
            payload: error?.message || "Failed to add billing record",
        });
    }
}

export function* addBillingWatcher() {
    yield takeLatest(
        `${SagaActions.ADD}_${SagaActions.ADMIN_BILLING}_${SagaActionType.REQUEST}`,
        addBillingSaga
    );
}

export default addBillingWatcher;