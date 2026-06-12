import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export interface AddBillingPayload {
  serviceName: string;
  category: string;
  amount: number;
  paidOn: string;
  nextRenewal: string;
  billingCycle: string;
  autoRemindBefore: string;
  paidVia: string;
  notes: string;
}

export const addBilling = createAction<AddBillingPayload>(
  `${SagaActions.ADD}_${SagaActions.ADMIN_BILLING}_${SagaActionType.REQUEST}`
);