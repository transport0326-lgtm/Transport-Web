// store.ts
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../index";
import loginReducer from "../slices/loginSlice";
import forgotPasswordReducer from "../slices/forgotPasswordSlice";
import resetPasswordReducer from "../slices/resetPasswordSlice";
import dashboardReducer from "../slices/dashboardSlice";
import liveBookingsReducer from "../slices/liveBookingSlice";
import riderManagementReducer from "../slices/riderManagementSlice";
import riderDetailReducer from "../slices/riderDetailSlice";
import reportsReducer from "../slices/reportsSlice";
import companyProfileReducer from "../slices/companyProfileSlice";
import pricingSettingsReducer from "../slices/pricingSettingsSlice";
import zoneSettingsReducer from "../slices/serviceZonesSlice";
import zoneConfigReducer from "../slices/zoneConfigSlice";
import notificationsReducer from "../slices/notificationsSlice";
import alertsCountReducer from "../slices/notificationsCountSlice";
import supportCountReducer from "../slices/supportCountSlice";
import fleetReducer from "../slices/fleetTrackingSlice";
import createZoneReducer from "../slices/createZoneWithRiderSlice";
import supportConversationsReducer from "../slices/supportConversationsSlice";
import conversationMessagesReducer from "../slices/conversationMessagesSlice";
import billingReducer from "../slices/billingSlice";
import platformConfigReducer from "../slices/platformConfigSlice";
import businessQuotesReducer from "../slices/businessQuotesSlice";
import contactMessagesReducer from "../slices/contactMessagesSlice";
import jobApplicationsReducer from "../slices/jobApplicationsSlice";
import quoteRequestsReducer from "../slices/quoteRequestsSlice";
import websiteLeadDetailReducer from "../slices/websiteLeadDetailSlice";

// Create and configure store
const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    login: loginReducer,
    forgotPassword: forgotPasswordReducer,
    resetPassword: resetPasswordReducer,
    dashboard: dashboardReducer,
    liveBookings: liveBookingsReducer,
    riderManagement: riderManagementReducer,
    riderDetail: riderDetailReducer,
    reports: reportsReducer,
    companyProfile: companyProfileReducer,
    pricingSettings: pricingSettingsReducer,
    zoneSettings: zoneSettingsReducer,
    zoneConfig: zoneConfigReducer,
    notifications: notificationsReducer,
    alertsCount: alertsCountReducer,
    supportCount: supportCountReducer,
    fleet: fleetReducer,
    createZone: createZoneReducer,
    supportConversations: supportConversationsReducer,
    conversationMessages: conversationMessagesReducer,
    billing:billingReducer,
    platformConfig: platformConfigReducer,
    businessQuotes: businessQuotesReducer,
    contactMessages: contactMessagesReducer,
    jobApplications: jobApplicationsReducer,
    quoteRequests: quoteRequestsReducer,
    websiteLeadDetail: websiteLeadDetailReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).concat(sagaMiddleware),
  devTools: import.meta.env.MODE !== "production",
});

// Start sagas
sagaMiddleware.run(rootSaga);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
