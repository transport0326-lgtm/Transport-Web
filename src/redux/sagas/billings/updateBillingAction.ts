import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagaConstants";

export interface UpdateBillingPayload {
  id: string;
  serviceName?: string;
  category?: string;
  amount?: number;
  paidOn?: string;
  nextRenewal?: string;
  billingCycle?: string;
  autoRemindBefore?: string;
  notes?: string;
}

export const updateBilling = createAction<UpdateBillingPayload>(
  `${SagaActions.PATCH}_${SagaActions.ADMIN_BILLING}_${SagaActionType.REQUEST}`
);
