import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLogin from './pages/auth/AdminLogin'
import AdminSignup from './pages/auth/AdminSignup'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import Dashboard from './pages/dashboard/Dashboard'
import LiveBookings from './pages/live-bookings/LiveBookings'
import RiderManagement from './pages/riders/RiderManagement'
import RiderProfile from './pages/riders/RiderProfile'
import FleetTracking from './pages/fleet/FleetTracking'
import Reports from './pages/reports/Reports'
import Settings from './pages/settings/Settings'
import NewRider from './pages/riders/AddNewRider'
import NotificationsPage from './pages/notifications/NotificationsPage'
import Expense from './pages/expense/Expense'
import SupportChat from './pages/support/SupportChat'
import WebsiteLeads from './pages/websiteLeads/WebsiteLeads'
import PrivateRoute from './routes/guards/PrivateRoute'
import PublicRoute from './routes/guards/PublicRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/login" replace />} />

      <Route element={<PublicRoute />}>
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/live-bookings" element={<LiveBookings />} />
        <Route path="/riders" element={<RiderManagement />} />
        <Route path="/riders/:id" element={<RiderProfile />} />
        <Route path="/fleet" element={<FleetTracking />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/newRider" element={<NewRider />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/expense" element={<Expense />} />
        <Route path="/support-chat" element={<SupportChat />} />
        <Route path="/website-leads" element={<WebsiteLeads />} />
      </Route>
    </Routes>
  )
}

export default App
