// import axios from "axios";
// // 상황따라 주소 다름
// const LOCAL_BACKEND = process.env.REACT_APP_LOCAL_BACKEND;
// // const PROD_BACKEND = process.env.REACT_APP_PROD_BACKEND;
// // const BACKEND_PROXY = process.env.REACT_APP_BACKEND_PROXY;
// // console.log("proxy", BACKEND_PROXY);
// const api = axios.create({
//   baseURL: LOCAL_BACKEND,
//   headers: {
//     "Content-Type": "application/json",
//     authorization: `Bearer ${sessionStorage.getItem("token")}`,
//   },
// });
// /**
//  * console.log all requests and responses
//  */
// api.interceptors.request.use(
//   (request) => {
//     console.log("Starting Request", request);
//     request.headers.authorization = `Bearer ${sessionStorage.getItem("token")}`;
//     return request;
//   },
//   function (error) {
//     console.log("REQUEST ERROR", error);
//   },
// );

// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   function (error) {
//     error = error.response.data;
//     console.log("RESPONSE ERROR", error);
//     return Promise.reject(error);
//   },
// );

// export default api;

import axios from "axios";

/**
 * Axios instance (Vite)
 * - env: VITE_BACKEND_URL (e.g., http://localhost:5051)
 * - baseURL: `${VITE_BACKEND_URL}/api`
 */
export const STORAGE_KEY = "todo_auth";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5051";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

/** Request interceptor: attach token + log request */
api.interceptors.request.use(
  (config) => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const token = parsed?.token;

        if (token) {
          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch {
      // ignore invalid JSON
    }

    if (import.meta.env.DEV) console.log("Starting Request", config);
    return config;
  },
  (error) => {
    if (import.meta.env.DEV) console.log("REQUEST ERROR", error);
    return Promise.reject(error);
  },
);

/**
 * Response interceptor: log response (dev) + normalize errors
 * - If server responds: reject with `error.response.data`
 * - If no response (network/CORS): reject with original error
 */
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) console.log("Response:", response);
    return response;
  },
  (error) => {
    const payload = error?.response?.data ?? error;
    if (import.meta.env.DEV) console.log("RESPONSE ERROR", payload);
    return Promise.reject(payload);
  },
);

export default api;
