// Authentication utility functions

/**
 * Get the authentication token from storage
 * Priority: 1. Redux state, 2. localStorage, 3. sessionStorage
 */
export const getAuthToken = (): string | null => {
  // Try localStorage first (for persistence)
  const localToken = localStorage.getItem("token");
  if (localToken) return localToken;

  // Try sessionStorage as fallback
  const sessionToken = sessionStorage.getItem("token");
  if (sessionToken) return sessionToken;

  return null;
};

/**
 * Store the authentication token
 * @param token JWT token to store
 * @param persistent Whether to store in localStorage (true) or sessionStorage (false)
 */
export const storeAuthToken = (
  token: string,
  persistent: boolean = true
): void => {
  if (persistent) {
    localStorage.setItem("token", token);
  } else {
    sessionStorage.setItem("token", token);
  }
};

/**
 * Clear all authentication data
 */
export const clearAuthData = (): void => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("pageReloadTimestamp");
  sessionStorage.removeItem("lastActivity");
};

/**
 * Update the user's last activity timestamp
 */
export const updateLastActivity = (): void => {
  const now = Date.now();
  sessionStorage.setItem("lastActivity", now.toString());
};

/**
 * Check if the user has been inactive for too long
 * @param inactivityTimeout Timeout in milliseconds
 * @returns boolean True if the user has been inactive for too long
 */
export const checkUserInactivity = (
  inactivityTimeout: number = 15 * 60 * 1000
): boolean => {
  const now = Date.now();
  const lastActivity = sessionStorage.getItem("lastActivity");

  if (!lastActivity) return false;

  const lastActivityTime = parseInt(lastActivity, 10);
  return now - lastActivityTime > inactivityTimeout;
};

/**
 * Check if the current user has admin role
 * @param userRole The user's role from the Redux state
 */
export const isAdmin = (userRole: string | undefined): boolean => {
  return userRole === "admin";
};

/**
 * Create Authorization header for API requests
 */
export const getAuthHeader = (): Record<string, string> => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
