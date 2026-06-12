// actions/companySettingsAction.ts
import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export const fetchCompanyProfile = createAction(
  `${SagaActions.GET}_${SagaActions.COMPANY_PROFILE}_${SagaActionType.REQUEST}`
);

// actions/companyProfileAction.ts — existing file mein add karo
export const updateCompanyProfile = createAction<{
  companyName: string;
  contactEmail: string;
  phoneNumber: string;
  businessAddress: string;
  gstNumber: string;
  defaultCurrency: string;
}>(
  `${SagaActions.PATCH}_${SagaActions.COMPANY_PROFILE}_${SagaActionType.REQUEST}`
);