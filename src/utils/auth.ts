const TOKEN_KEY = "token";
const SESSION_KEY = "session_active";

export const getAuthToken = (): string | null =>
  localStorage.getItem(TOKEN_KEY);

export const isAuthenticated = (): boolean =>
  !!localStorage.getItem(TOKEN_KEY) &&
  !!sessionStorage.getItem(SESSION_KEY);

export const saveSession = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(SESSION_KEY, "true");
};

export const clearSession = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(SESSION_KEY);
};
