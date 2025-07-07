import axios from "axios";

const NEXT_PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://next-js-one-ivory.vercel.app/api";

const instance = axios.create({
  baseURL: NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve();
  });
  failedQueue = [];
};

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => instance(originalRequest));
      }

      isRefreshing = true;

      try {
        await instance.post("/auth/refresh", null, {
          validateStatus: (status) => status < 400,
        });

        processQueue(null);
        return instance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        try {
          await instance.post("/auth/logout");
          console.log("✅ Logout API called successfully");
        } catch (logoutError) {}

        if (typeof window !== "undefined") {
          window.location.assign("/login");
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export async function logout() {
  try {
    await instance.post("/auth/logout");
    if (typeof window !== "undefined") {
      window.location.assign("/login");
    }
  } catch (err) {
    console.error("Logout failed:", err);
  }
}

export default instance;
