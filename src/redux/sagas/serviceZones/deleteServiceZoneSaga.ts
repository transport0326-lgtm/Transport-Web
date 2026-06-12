import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { getAuthToken } from "../../../utils/auth";

function* deleteServiceZoneSaga(action: {
    type: string;
    payload: {
        zoneId: string;
    };
}): Generator<any, void, any> {
    yield put({
        type: `${SagaActions.DELETE}_${SagaActions.ADMIN_SERVICE_ZONES}`,
    });

    try {
        const token = getAuthToken();
        const { zoneId } = action.payload;

        const response = yield call(
            apiRequest,
            `${API_ENDPOINTS.ADMIN.SERVICE_ZONES}/${zoneId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        yield put({
            type: `${SagaActions.DELETE}_${SagaActions.ADMIN_SERVICE_ZONES}_${SagaActionType.SUCCESS}`,
            payload: response,
        });
        yield put({
            type: `${SagaActions.GET}_${SagaActions.ZONE_SETTINGS}_${SagaActionType.REQUEST}`,
        });
    } catch (error: any) {
        yield put({
            type: `${SagaActions.DELETE}_${SagaActions.ADMIN_SERVICE_ZONES}_${SagaActionType.FAIL}`,
            payload: error?.message || "Failed to delete service zone",
        });
    }
}

export function* deleteServiceZoneWatcher() {
    yield takeLatest(
        `${SagaActions.DELETE}_${SagaActions.ADMIN_SERVICE_ZONES}_${SagaActionType.REQUEST}`,
        deleteServiceZoneSaga,
    );
}

export default deleteServiceZoneWatcher;
