// slices/notificationsSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../sagas/sagaConstants";

export interface NotificationAction {
  label: string;
  href: string;
}

export interface Alert {
  id: string;
  type: string;
  priority: string;
  title: string;
  message: string;
  count: number;
  action: NotificationAction;
  createdAt: string;
}

export interface NotificationsData {
  success: boolean;
  unreadCount: number;
  alerts: Alert[];
}

interface NotificationsState {
  data: NotificationsData | null;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  data: null,
  loading: false,
  error: null,
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type === `${SagaActions.GET}_${SagaActions.ADMIN_NOTIFICATIONS}`,
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type ===
        `${SagaActions.GET}_${SagaActions.ADMIN_NOTIFICATIONS}_${SagaActionType.SUCCESS}`,
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      }
    );

    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type ===
        `${SagaActions.GET}_${SagaActions.ADMIN_NOTIFICATIONS}_${SagaActionType.FAIL}`,
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        state.loading = false;
        state.error = action.payload;
      }
    );

    builder.addMatcher(
      (action: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        action.type ===
        `${SagaActions.PATCH}_${SagaActions.ADMIN_MARK_ALERTS_READ}_${SagaActionType.SUCCESS}`,
      (state, action: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        if (state.data && action.payload) {
          state.data = {
            ...state.data,
            unreadCount: action.payload.unreadCount ?? state.data.unreadCount,
            alerts: action.payload.alerts ?? state.data.alerts,
          };
        }
      }
    );
  },
});

export const { clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;