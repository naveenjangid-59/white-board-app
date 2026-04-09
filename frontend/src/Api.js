import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3030/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const message = error?.response?.data?.message;
    // console.log("API error response: ", error.response.data.message);

    // If access token expired
    if (message === "AccessTokenExpired" && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // call refresh token API
        await api.post("/user/refresh-token");

        // retry original request
        const newResponse = await api(originalRequest);
        return newResponse;
      } catch (refreshError) {
        const refreshMessage = refreshError?.response?.data?.message;

        // if refresh token also expired → logout
        if (refreshMessage === "RefreshTokenExpired") {
          if (window.location.pathname !== "/") {
            window.location.assign("/");
          }
        }

        throw refreshError;
      }
    }

    throw error;
  },
);

export default api;
