/**
 * Utilities for normalizing Axios / fetch errors, including ad-blocker blocks.
 */

const BLOCKED_CODES = new Set([
  "ERR_BLOCKED_BY_CLIENT",
  "ERR_NETWORK",
  "ECONNABORTED",
]);

const BLOCKED_MESSAGE_FRAGMENTS = [
  "network error",
  "blocked by client",
  "failed to fetch",
  "load failed",
];

export function isBlockedByClient(error) {
  if (!error) return false;

  const code = error.code?.toUpperCase?.() ?? "";
  if (BLOCKED_CODES.has(code)) return true;

  const message = `${error.message ?? ""}`.toLowerCase();
  return BLOCKED_MESSAGE_FRAGMENTS.some((fragment) => message.includes(fragment));
}

export function isTimeoutError(error) {
  if (!error) return false;
  return error.code === "ECONNABORTED" || /timeout/i.test(error.message ?? "");
}

export function isRetryableError(error) {
  if (!error) return false;
  if (isBlockedByClient(error) || isTimeoutError(error)) return false;

  const status = error.response?.status;
  if (!status) return false;

  return status >= 500 || status === 408 || status === 429;
}

export function getApiErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (!error) return fallback;

  if (isBlockedByClient(error)) {
    return "Request blocked by a browser extension (AdBlock, uBlock, Brave Shields, etc.). Disable it for this site or allow localhost API requests, then retry.";
  }

  if (isTimeoutError(error)) {
    return "The request timed out. Check your connection and try again.";
  }

  const serverMessage = error.response?.data?.message;
  if (typeof serverMessage === "string" && serverMessage.trim()) {
    return serverMessage;
  }

  const status = error.response?.status;
  if (status === 401) return "You are not authorized. Please sign in again.";
  if (status === 403) return "You do not have permission to perform this action.";
  if (status === 404) return "The requested resource was not found.";
  if (status >= 500) return "Server error. Please try again in a moment.";

  if (error.message && !/^request failed with status code/i.test(error.message)) {
    return error.message;
  }

  return fallback;
}

export async function withApiErrorHandling(promise, fallbackMessage) {
  try {
    return await promise;
  } catch (error) {
    throw Object.assign(error, {
      userMessage: getApiErrorMessage(error, fallbackMessage),
    });
  }
}
