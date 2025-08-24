import axios from "axios";

const API_BASE = import.meta.env?.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

// Axios instance for /api
export const api = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true, // needed for Sanctum cookie-based auth
});

// Ensure CSRF cookie for Sanctum SPA (cookie-based)
export const ensureCsrf = async () => {
  try {
    // this endpoint is NOT under /api
    await axios.get(`${API_BASE}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
  } catch (_) {
    // ignore; backend may be using token-based auth only
  }
};

// Helper: attach Bearer token when available
export const withAuth = (userOrToken) => {
  const token =
    typeof userOrToken === "string"
      ? userOrToken
      : userOrToken?.token || userOrToken?.access_token;
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

// Helper: build image URL (supports stored paths and http links)
export const imageUrl = (path) => {
  if (!path)
    return "https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1";
  if (
    typeof path === "string" &&
    (path.startsWith("http://") || path.startsWith("https://"))
  )
    return path;
  return `${API_BASE}/storage/${path}`;
};
