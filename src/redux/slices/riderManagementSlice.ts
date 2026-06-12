import { createSlice } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagas/sagaConstants";

export interface RiderManagementStats {
    pending: number;
    approved: number;
    rejected: number;
    suspended: number;
    total: number;
}

export interface RiderBankAccount {
    accountHolderName: string | null;
    accountNumber: string | null;
    accountType: string;
    bankName: string | null;
    ifscCode: string | null;
}

export interface Rider {
    _id: string;
    name: string;
    phone: string;
    email: string;
    profilePhotoUrl: string | null;
    vehicleType: string;
    vehicleNumber: string;
    dlNumber: string;
    dlPhotoUrl: string | null;
    dlStatus: string;
    rcNumber: string;
    rcPhotoUrl: string | null;
    rcStatus: string;
    hasDL: boolean;
    hasRC: boolean;
    isOnline: boolean;
    isActive: boolean;
    isProfileComplete: boolean;
    isSuspended: boolean;
    zoneId: string | null;
    emergencyContact: string | null;
    currentAddress: string | null;
    upiId: string | null;
    fcmToken: string;
    rejectionReason: string | null;
    razorpayContactId: string | null;
    razorpayFundAccountId: string | null;
    bankAccount: RiderBankAccount;
    trips: number;
    avgRating: number | null;
    accountStatus: string;
    createdAt: string;
}

export interface RiderManagementData {
    success: boolean;
    stats: RiderManagementStats;
    total: number;
    page: number;
    riders: Rider[];
}

interface RiderManagementState {
    data: RiderManagementData | null;
    loading: boolean;
    error: string | null;
    approveLoading: boolean;
    approveError: string | null;
    approveSuccess: boolean;
    rejectLoading: boolean;
    rejectError: string | null;
    rejectSuccess: boolean;
    suspendLoading: boolean;
    suspendError: string | null;
    suspendSuccess: boolean;
    unsuspendLoading: boolean;
    unsuspendError: string | null;
    unsuspendSuccess: boolean;
    onboardLoading: boolean;
    onboardError: string | null;
    onboardSuccess: boolean;
}

const initialState: RiderManagementState = {
    data: null,
    loading: false,
    error: null,
    approveLoading: false,
    approveError: null,
    approveSuccess: false,
    rejectLoading: false,
    rejectError: null,
    rejectSuccess: false,
    suspendLoading: false,
    suspendError: null,
    suspendSuccess: false,
    unsuspendLoading: false,
    unsuspendError: null,
    unsuspendSuccess: false,
    onboardLoading: false,
    onboardError: null,
    onboardSuccess: false,
};

export const riderManagementSlice = createSlice({
    name: "riderManagement",
    initialState,
    reducers: {
        clearRiderManagement: (state) => {
            state.data = null;
            state.loading = false;
            state.error = null;
        },
        resetApprove: (state) => {
            state.approveLoading = false;
            state.approveError = null;
            state.approveSuccess = false;
        },
        resetReject: (state) => {
            state.rejectLoading = false;
            state.rejectError = null;
            state.rejectSuccess = false;
        },
        resetSuspend: (state) => {
            state.suspendLoading = false;
            state.suspendError = null;
            state.suspendSuccess = false;
        },
        resetUnsuspend: (state) => {
            state.unsuspendLoading = false;
            state.unsuspendError = null;
            state.unsuspendSuccess = false;
        },
        resetOnboard: (state) => {
            state.onboardLoading = false;
            state.onboardError = null;
            state.onboardSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            (action: any) =>
                action.type === `${SagaActions.GET}_${SagaActions.ADMIN_RIDER_MANAGEMENT}_${SagaActionType.REQUEST}`,
            (state) => {
                state.loading = true;
                state.error = null;
            }
        );

        builder.addMatcher(
            (action: any) =>
                action.type === `${SagaActions.GET}_${SagaActions.ADMIN_RIDER_MANAGEMENT}_${SagaActionType.SUCCESS}`,
            (state, action: any) => {
                state.data = action.payload;
                state.loading = false;
            }
        );

        builder.addMatcher(
            (action: any) =>
                action.type === `${SagaActions.GET}_${SagaActions.ADMIN_RIDER_MANAGEMENT}_${SagaActionType.FAIL}`,
            (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            }
        );

        builder.addMatcher(
            (action: any) =>
                action.type === `${SagaActions.PATCH}_${SagaActions.APPROVE_RIDER}`,
            (state) => {
                state.approveLoading = true;
                state.approveError = null;
                state.approveSuccess = false;
            }
        );

        builder.addMatcher(
            (action: any) =>
                action.type === `${SagaActions.PATCH}_${SagaActions.APPROVE_RIDER}_${SagaActionType.SUCCESS}`,
            (state) => {
                state.approveLoading = false;
                state.approveSuccess = true;
            }
        );

        builder.addMatcher(
            (action: any) =>
                action.type === `${SagaActions.PATCH}_${SagaActions.APPROVE_RIDER}_${SagaActionType.FAIL}`,
            (state, action: any) => {
                state.approveLoading = false;
                state.approveError = action.payload;
            }
        );

        builder.addMatcher(
            (action: any) =>
                action.type === `${SagaActions.PATCH}_${SagaActions.REJECT_RIDER}`,
            (state) => {
                state.rejectLoading = true;
                state.rejectError = null;
                state.rejectSuccess = false;
            }
        );

        builder.addMatcher(
            (action: any) =>
                action.type === `${SagaActions.PATCH}_${SagaActions.REJECT_RIDER}_${SagaActionType.SUCCESS}`,
            (state) => {
                state.rejectLoading = false;
                state.rejectSuccess = true;
            }
        );

        builder.addMatcher(
            (action: any) =>
                action.type === `${SagaActions.PATCH}_${SagaActions.REJECT_RIDER}_${SagaActionType.FAIL}`,
            (state, action: any) => {
                state.rejectLoading = false;
                state.rejectError = action.payload;
            }
        );

        builder.addMatcher(
            (action: any) =>
                action.type === `${SagaActions.PATCH}_${SagaActions.SUSPEND_RIDER}`,
            (state) => {
                state.suspendLoading = true;
                state.suspendError = null;
                state.suspendSuccess = false;
            }
        );

        builder.addMatcher(
            (action: any) =>
                action.type === `${SagaActions.PATCH}_${SagaActions.SUSPEND_RIDER}_${SagaActionType.SUCCESS}`,
            (state) => {
                state.suspendLoading = false;
                state.suspendSuccess = true;
            }
        );

        builder.addMatcher(
            (action: any) =>
                action.type === `${SagaActions.PATCH}_${SagaActions.SUSPEND_RIDER}_${SagaActionType.FAIL}`,
            (state, action: any) => {
                state.suspendLoading = false;
                state.suspendError = action.payload;
            }
        );

        builder.addMatcher(
            (action: any) =>
                action.type === `${SagaActions.PATCH}_${SagaActions.UNSUSPEND_RIDER}`,
            (state) => {
                state.unsuspendLoading = true;
                state.unsuspendError = null;
                state.unsuspendSuccess = false;
            }
        );

        builder.addMatcher(
            (action: any) =>
                action.type === `${SagaActions.PATCH}_${SagaActions.UNSUSPEND_RIDER}_${SagaActionType.SUCCESS}`,
            (state) => {
                state.unsuspendLoading = false;
                state.unsuspendSuccess = true;
            }
        );

        builder.addMatcher(
            (action: any) =>
                action.type === `${SagaActions.PATCH}_${SagaActions.UNSUSPEND_RIDER}_${SagaActionType.FAIL}`,
            (state, action: any) => {
                state.unsuspendLoading = false;
                state.unsuspendError = action.payload;
            }
        );

        builder.addMatcher(
            (action: any) =>
                action.type === `${SagaActions.POST}_${SagaActions.ONBOARD_RIDER}`,
            (state) => {
                state.onboardLoading = true;
                state.onboardError = null;
                state.onboardSuccess = false;
            }
        );

        builder.addMatcher(
            (action: any) =>
                action.type === `${SagaActions.POST}_${SagaActions.ONBOARD_RIDER}_${SagaActionType.SUCCESS}`,
            (state) => {
                state.onboardLoading = false;
                state.onboardSuccess = true;
            }
        );

        builder.addMatcher(
            (action: any) =>
                action.type === `${SagaActions.POST}_${SagaActions.ONBOARD_RIDER}_${SagaActionType.FAIL}`,
            (state, action: any) => {
                state.onboardLoading = false;
                state.onboardError = action.payload;
            }
        );
    },
});

export const { clearRiderManagement, resetApprove, resetReject, resetSuspend, resetUnsuspend, resetOnboard } = riderManagementSlice.actions;
export default riderManagementSlice.reducer;