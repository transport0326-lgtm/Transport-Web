const isProduction = import.meta.env.MODE === 'production';
const API_BASE_URL = isProduction
  ? import.meta.env.VITE_API_BASE_URL || 'https://api.transpport.com'
  : '';

const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'admin/auth/login',
    FORGOT_PASSWORD: 'admin/auth/forgot-password',
    RESET_PASSWORD: 'admin/auth/reset-password',
  },
  ADMIN: {
    DASHBOARD: 'admin/dashboard',
    LIVE_BOOKINGS: "/admin/dashboard/live-bookings",
    RIDER_MANAGEMENT: "/admin/dashboard/rider-management",
    REPORTS: "/admin/dashboard/reports",
    COMPANY_PROFILE: "/admin/settings/company",
    PRICING_SETTINGS: "/admin/settings/pricing",
    ZONE_SETTINGS: "/admin/settings/zones",
    SERVICE_ZONES: "/admin/settings/zones",
    ZONE_CONFIG: "/admin/settings/zone-config",
    NOTIFICATIONS: "/admin/notifications",
    ALERTS_COUNT: "/admin/notifications/alerts-count",
    MARK_ALERTS_READ: "/admin/notifications/mark-alerts-read",
    SUPPORT_COUNT: "/admin/notifications/support-count",
    FLEET: "/admin/dashboard/fleet",
    BILLING: "/billing",
    BILLING_RECORD: "/billing",
    CREATE_ZONE: "/admin/dashboard/zones/create-with-rider",
    SUPPORT_CONVERSATIONS: "/admin/support/conversations",
    PRICING: "/admin/settings/pricing",
    SETTINGS_PRICING: "/admin/settings/pricing",
    REPORTS_EXPORT_EXCEL: "/admin/dashboard/reports/export-pdf",
    EXPORT_EXCEL: "/billing/export-excel",
    ZONES_ASSIGN_RIDER: "/admin/dashboard/zones/assign-rider",
    ZONE: "/zones",
    PLATFORM_CONFIG: "/admin/settings/platform-config",
    BUSINESS_QUOTES: "/admin/business-quotes",
    CONTACT_MESSAGES: "/admin/contact-messages",
    JOB_APPLICATIONS: "/admin/job-applications",
    QUOTE_REQUESTS: "/admin/quote-requests",
  },
};

export const buildApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  return cleanBaseUrl ? `${cleanBaseUrl}/${cleanEndpoint}` : `/api/${cleanEndpoint}`;
};

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  // const requestId = Math.random().toString(36).substring(2, 6);

  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  const baseUrl = isProduction ? cleanBaseUrl : '';
  const url = baseUrl ? `${baseUrl}/${cleanEndpoint}` : `/api/${cleanEndpoint}`;

  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && (options.method === 'POST' || options.method === 'PUT')) {
    headers.set('Content-Type', 'application/json');
  }

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
    credentials: 'include',
    mode: 'cors',
    ...options,
  };

  try {
    const response = await fetch(url, config);

    const responseText = await response.text();

    let responseData: unknown;
    try {
      responseData = responseText ? JSON.parse(responseText) : null;
    } catch {
      responseData = responseText;
    }

    if (!response.ok) {
      let errorMessage = 'An error occurred';

      if (typeof responseData === 'object' && responseData !== null) {
        const data = responseData as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
        if (data.error) errorMessage = data.error;
        else if (data.message) errorMessage = data.message;
        else if (data.errors) {
          errorMessage = Array.isArray(data.errors)
            ? data.errors.map((e: any) => e.message || e).join(', ') // eslint-disable-line @typescript-eslint/no-explicit-any
            : data.errors;
        }
      } else if (response.statusText) {
        errorMessage = response.statusText;
      }

      const error = new Error(errorMessage) as any;
      error.status = response.status;
      error.statusText = response.statusText;
      error.data = responseData;
      error.response = responseData;
      throw error;
    }

    return responseData;
  } catch (error: any) {
    if (error.status) throw error;

    const networkError = new Error(
      error.message || 'Network error occurred'
    ) as any;
    networkError.original = error;
    throw networkError;
  }
};

export default API_ENDPOINTS;