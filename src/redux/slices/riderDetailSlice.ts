import { createSlice } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagas/sagaConstants";

export interface RiderSuspension {
  reason: string | null;
  duration: string | null;
  suspendedBy: string | null;
  suspendedAt: string | null;
  autoReinstate: string | null;
  notes: string | null;
}

export interface RiderDetailRider {
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
  suspension: RiderSuspension | null;
  zoneId: string | null;
  emergencyContact: string | null;
  currentAddress: string | null;
  upiId: string | null;
  fcmToken: string;
  rejectionReason: string | null;
  razorpayContactId: string | null;
  razorpayFundAccountId: string | null;
  bankAccount: {
    accountHolderName: string | null;
    accountNumber: string | null;
    accountType: string;
    bankName: string | null;
    ifscCode: string | null;
  };
  createdAt: string;
}

export interface RiderDetailStats {
  trips: number;
  avgRating: number | null;
  totalRatings: number;
  completionRate: number;
}

export interface RiderDetailDocument {
  url: string | null;
  number: string;
  status: string;
}

export interface RiderDetailDocuments {
  dl: RiderDetailDocument;
  rc: RiderDetailDocument;
}

export interface RiderDetailTrip {
  bookingNumber: string;
  customerName: string;
  pickup: string;
  dropoff: string;
  amount: number;
  status: string;
  date: string;
}

export interface RiderDetailZone {
  _id?: string;
  name?: string;
  city?: string;
}

export interface RiderFeedbackReview {
  customerName: string;
  stars: number;
  tags: string[];
  comment: string | null;
  date: string;
}

export interface RiderCustomerFeedback {
  avgRating: number | null;
  totalRatings: number;
  starDistribution: Record<"1" | "2" | "3" | "4" | "5", number>;
  reviews: RiderFeedbackReview[];
}

export interface RiderDetailData {
  success: boolean;
  rider: RiderDetailRider;
  stats: RiderDetailStats;
  documents: RiderDetailDocuments;
  recentTrips: RiderDetailTrip[];
  zone: RiderDetailZone | null;
  customerFeedback?: RiderCustomerFeedback;
}

interface RiderDetailState {
  data: RiderDetailData | null;
  loading: boolean;
  error: string | null;
  deleteLoading: boolean;
  deleteError: string | null;
  deleteSuccess: boolean;
}

const initialState: RiderDetailState = {
  data: null,
  loading: false,
  error: null,
  deleteLoading: false,
  deleteError: null,
  deleteSuccess: false,
};

export const riderDetailSlice = createSlice({
  name: "riderDetail",
  initialState,
  reducers: {
    clearRiderDetail: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
    resetDelete: (state) => {
      state.deleteLoading = false;
      state.deleteError = null;
      state.deleteSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: any) =>
        action.type === `${SagaActions.GET}_${SagaActions.ADMIN_RIDER_DETAIL}_${SagaActionType.REQUEST}`,
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      (action: any) =>
        action.type === `${SagaActions.GET}_${SagaActions.ADMIN_RIDER_DETAIL}_${SagaActionType.SUCCESS}`,
      (state, action: any) => {
        state.data = action.payload;
        state.loading = false;
      }
    );

    builder.addMatcher(
      (action: any) =>
        action.type === `${SagaActions.GET}_${SagaActions.ADMIN_RIDER_DETAIL}_${SagaActionType.FAIL}`,
      (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      }
    );

    builder.addMatcher(
      (action: any) =>
        action.type === `${SagaActions.DELETE}_${SagaActions.ADMIN_RIDER_DETAIL}`,
      (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
        state.deleteSuccess = false;
      }
    );

    builder.addMatcher(
      (action: any) =>
        action.type === `${SagaActions.DELETE}_${SagaActions.ADMIN_RIDER_DETAIL}_${SagaActionType.SUCCESS}`,
      (state) => {
        state.deleteLoading = false;
        state.deleteSuccess = true;
      }
    );

    builder.addMatcher(
      (action: any) =>
        action.type === `${SagaActions.DELETE}_${SagaActions.ADMIN_RIDER_DETAIL}_${SagaActionType.FAIL}`,
      (state, action: any) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      }
    );

    builder.addMatcher(
      (action: any) =>
        action.type === `${SagaActions.PATCH}_${SagaActions.ADMIN_RIDER_DOCUMENT}_${SagaActionType.SUCCESS}`,
      (state, action: any) => {
        if (!state.data) return;
        const { docType, status } = action.payload as { docType: 'dl' | 'rc'; status: string };
        if (docType === 'dl' || docType === 'rc') {
          state.data.documents[docType].status = status;
        }
      }
    );
  },
});

export const { clearRiderDetail, resetDelete } = riderDetailSlice.actions;
export default riderDetailSlice.reducer;
