
const BASE_URL = ""; 
// "https://test.healthizm.in" → direct API call

export const API_ENDPOINTS = {};

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const requestId = Math.random().toString(36).substring(2, 6);

  const cleanEndpoint = endpoint.replace(/^\/+/, "");
  const url = BASE_URL
    ? `${BASE_URL}/${cleanEndpoint}`
    : `/api/${cleanEndpoint}`;

  const headers = new Headers(options.headers);

  if (
    !headers.has("Content-Type") &&
    (options.method === "POST" || options.method === "PUT")
  ) {
    headers.set("Content-Type", "application/json");
  }

  if (options.body) {
    try {
      const bodyObj =
        typeof options.body === "string"
          ? JSON.parse(options.body)
          : options.body;

      console.log(`🌐 [${requestId}] Request Body:`, bodyObj);
    } catch {
      console.error(`🌐 [${requestId}] Request Body (raw):`, options.body);
    }
  }

  const config: RequestInit = {
    headers: {
      Accept: "application/json",
      ...Object.fromEntries(headers.entries()),
    },
    credentials: "include",
    mode: "cors",
    ...options,
  };

  try {
    const response = await fetch(url, config);

    const responseText = await response.text();

    let responseData: unknown;
    try {
      responseData = responseText ? JSON.parse(responseText) : null;
    } catch {
      console.error(`🌐 [${requestId}] Response Body (raw):`, responseText);
      responseData = responseText;
    }

    if (!response.ok) {
      console.error(`🌐 [${requestId}] API Error:`, {
        status: response.status,
        statusText: response.statusText,
        url,
        response: responseData || responseText,
      });

      let errorMessage = "An error occurred";

      if (typeof responseData === "object" && responseData !== null) {
        const data = responseData as Record<string, any>;// eslint-disable-line @typescript-eslint/no-explicit-any

        if (data.error) errorMessage = data.error;
        else if (data.message) errorMessage = data.message;
        else if (data.errors) {
          errorMessage = Array.isArray(data.errors)
            ? data.errors.map((e: any) => e.message || e).join(", ")// eslint-disable-line @typescript-eslint/no-explicit-any
            : data.errors;
        }
      } else if (response.statusText) {
        errorMessage = response.statusText;
      }

      const error = new Error(errorMessage) as any;// eslint-disable-line @typescript-eslint/no-explicit-any
      error.status = response.status;
      error.statusText = response.statusText;
      error.data = responseData;

      throw error;
    }

    return responseData;
  } catch (error: any) {// eslint-disable-line @typescript-eslint/no-explicit-any
    if (error.status) {
      throw error;
    }

    console.error("API request failed:", error);

    const networkError = new Error(
      error.message || "Network error occurred"
    ) as any;// eslint-disable-line @typescript-eslint/no-explicit-any

    networkError.original = error;

    throw networkError;
  }
};

export default API_ENDPOINTS;