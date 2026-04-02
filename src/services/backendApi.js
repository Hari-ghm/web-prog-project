const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token || null;
};

const defaultHeaders = {
  'Content-Type': 'application/json'
};

const request = async (path, options = {}) => {
  const headers = {
    ...defaultHeaders,
    ...(options.headers || {})
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers,
    ...options
  });

  let payload = {};
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (!response.ok) {
    throw new Error(payload.message || 'Request failed');
  }

  return payload;
};

export const api = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
  me: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),

  getPreferences: () => request('/preferences'),
  savePreferences: (updates) =>
    request('/preferences', {
      method: 'PUT',
      body: JSON.stringify(updates)
    }),

  getAdminConfig: () => request('/admin/config'),
  addState: (statePayload) =>
    request('/admin/states', {
      method: 'POST',
      body: JSON.stringify(statePayload)
    }),
  addCity: (cityPayload) =>
    request('/admin/cities', {
      method: 'POST',
      body: JSON.stringify(cityPayload)
    })
};
