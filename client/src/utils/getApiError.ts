/**
 * Extract a user-friendly error message from API/axios errors.
 */
export function getApiError(
  err: unknown,
  fallback = 'Something went wrong. Please try again.'
): string {
  if (!err || typeof err !== 'object') return fallback;
  const axiosErr = err as {
    response?: { status?: number; data?: { message?: string; errors?: unknown } };
    code?: string;
    message?: string;
  };
  const message = axiosErr.response?.data?.message;
  if (typeof message === 'string' && message.trim()) return message;
  if (axiosErr.response?.data?.errors && Array.isArray(axiosErr.response.data.errors)) {
    const first = axiosErr.response.data.errors[0];
    if (first && typeof first === 'object' && 'message' in first) {
      return String(first.message);
    }
  }
  if (axiosErr.response?.status === 401) return 'Invalid email or password.';
  if (axiosErr.response?.status === 409) return 'An account with this email already exists.';
  if (axiosErr.response?.status === 400) return 'Please check your input and try again.';
  if (axiosErr.response?.status) return axiosErr.response.data?.message || `Request failed (${axiosErr.response.status}).`;
  if (axiosErr.code === 'ECONNABORTED') return 'Request timed out. Please try again.';
  if (axiosErr.code === 'ERR_NETWORK' || axiosErr.code === 'ECONNREFUSED') {
    return 'Unable to connect. Make sure the backend server is running on port 5000.';
  }
  return fallback;
}
