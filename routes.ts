/**
 * An array of routes publicly accessible. NO Auth required.
 * @type {string[]}
 */
export const publicRoutes = ["/", "/auth/new-verification"];

/**
 * An array of routes for authentication. Will redirect logged in
 * users to /settings
 * @type {string[]}
 */
export const authRoutes = ["/auth/login", "/auth/register", "/auth/error"];

/**
 * Prefix for authentication routes.
 * Routes that start with this prefix are used for API auth purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * Default redirect route after login.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/workshop";
