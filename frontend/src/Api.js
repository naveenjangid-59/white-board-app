import axios from "axios";

const api = axios.create({
  baseURL: "https://white-board-app-production.up.railway.app/api",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;
    const message = error?.response?.data?.message;
    const requestUrl = originalRequest?.url || "";

    const isAuthRequest =
      requestUrl.includes("/user/login") ||
      requestUrl.includes("/user/register") ||
      requestUrl.includes("/user/refresh-token");

    const shouldRefresh =
      status === 401 && !originalRequest?._retry && !isAuthRequest;

    if (shouldRefresh) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/user/refresh-token");
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        const refreshMessage = refreshError?.response?.data?.message;
        if (
          (refreshMessage === "RefreshTokenExpired" ||
            refreshError?.response?.status === 401) &&
          window.location.pathname !== "/"
        ) {
          window.location.assign("/");
        }

        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    }

    throw error;
  },
);

export default api;
