const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

const buildHeaders = (options = {}) => {
  const headers = {
    Accept: "application/json",
    ...(options.headers || {}),
  };

  const token = getAuthToken();

  if (options.auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (options.json) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

export const apiRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options.method || "GET",

    headers: buildHeaders(options),

    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  let data = null;

  if (response.status !== 204) {
    data = await response.json();
  }

  return {
    response,
    data,
  };
};

export const apiGet = (endpoint, options = {}) => {
  return apiRequest(endpoint, {
    ...options,
    method: "GET",
  });
};

export const apiPost = (endpoint, body, options = {}) => {
  return apiRequest(endpoint, {
    ...options,
    method: "POST",
    json: true,
    body,
  });
};

export const apiPut = (endpoint, body, options = {}) => {
  return apiRequest(endpoint, {
    ...options,
    method: "PUT",
    json: true,
    body,
  });
};

export const apiDelete = (endpoint, options = {}) => {
  return apiRequest(endpoint, {
    ...options,
    method: "DELETE",
  });
};
