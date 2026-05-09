const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  // Get user from localStorage (assuming stored as { token, role, email })
  const user = JSON.parse(localStorage.getItem("user"));
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (user?.token) {
    headers.Authorization = `Bearer ${user.token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 – clear user and redirect
  if (response.status === 401) {
    localStorage.removeItem("user");
    window.location.href = "/login";
    return Promise.reject(new Error("Unauthorized"));
  }

  // For 204 No Content (e.g., DELETE)
  if (response.status === 204) return null;

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// Convenience methods
const api = {
  get: (endpoint) => request(endpoint, { method: "GET" }),
  post: (endpoint, body) =>
    request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  put: (endpoint, body) =>
    request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  delete: (endpoint) => request(endpoint, { method: "DELETE" }),
};

export default api;
