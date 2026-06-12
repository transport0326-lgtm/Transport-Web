import { call, put, takeLatest } from "redux-saga/effects";
import * as XLSX from "xlsx";
import API_ENDPOINTS, { buildApiUrl } from "../../../config/api.config";
import { SagaActions, SagaActionType } from "../sagaConstants";
import { getAuthToken } from "../../../utils/auth";

function* exportBillingExcelSaga(): Generator<any, void, any> {
  yield put({
    type: `${SagaActions.GET}_${SagaActions.BILLING_EXPORT_EXCEL}`,
  });

  try {
    const token = getAuthToken();

    const url = buildApiUrl(API_ENDPOINTS.ADMIN.EXPORT_EXCEL);

    const response: Response = yield call(fetch, url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText: string = yield call([response, response.text]);
      throw new Error(errorText || `Server error: ${response.status}`);
    }

    const htmlText: string = yield call([response, response.text]);

    const workbook = XLSX.read(htmlText, { type: "string" });
    const excelBuffer: ArrayBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fileUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = `billing_export_${new Date().toISOString().split("T")[0]}.xlsx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(fileUrl);

    yield put({
      type: `${SagaActions.GET}_${SagaActions.BILLING_EXPORT_EXCEL}_${SagaActionType.SUCCESS}`,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.GET}_${SagaActions.BILLING_EXPORT_EXCEL}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to export billing excel",
    });
  }
}

export function* exportBillingExcelWatcher() {
  yield takeLatest(
    `${SagaActions.GET}_${SagaActions.BILLING_EXPORT_EXCEL}_${SagaActionType.REQUEST}`,
    exportBillingExcelSaga,
  );
}

export default exportBillingExcelWatcher;