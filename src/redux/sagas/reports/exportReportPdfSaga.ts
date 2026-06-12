import { call, put, takeLatest } from "redux-saga/effects";
import API_ENDPOINTS, { buildApiUrl } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { getAuthToken } from "../../../utils/auth";

const EXCEL_MIME =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

function* exportReportExcelSaga(action: {
  type: string;
  payload: {
    from: string;
    to: string;
  };
}): Generator<any, void, any> {
  yield put({
    type: `${SagaActions.GET}_${SagaActions.ADMIN_REPORTS_EXPORT_EXCEL}`,
  });

  try {
    const token = getAuthToken();
    const { from, to } = action.payload;

    const params = new URLSearchParams({ from, to });

    const url = `${buildApiUrl(API_ENDPOINTS.ADMIN.REPORTS_EXPORT_EXCEL)}?${params.toString()}`;

    const response: Response = yield call(fetch, url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: EXCEL_MIME,
      },
    });

    if (!response.ok) {
      const errorText: string = yield call([response, response.text]);
      throw new Error(errorText || `Server error: ${response.status}`);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("spreadsheetml") && !contentType.includes("excel")) {
      const errorText: string = yield call([response, response.text]);
      throw new Error(`Expected Excel file but got: ${contentType} — ${errorText}`);
    }

    const blob: Blob = yield call([response, response.blob]);

    const fileUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = `report_${from}_to_${to}.xlsx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(fileUrl);

    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_REPORTS_EXPORT_EXCEL}_${SagaActionType.SUCCESS}`,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.GET}_${SagaActions.ADMIN_REPORTS_EXPORT_EXCEL}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to export Excel report",
    });
  }
}

export function* exportReportExcelWatcher() {
  yield takeLatest(
    `${SagaActions.GET}_${SagaActions.ADMIN_REPORTS_EXPORT_EXCEL}_${SagaActionType.REQUEST}`,
    exportReportExcelSaga
  );
}

export default exportReportExcelWatcher;
