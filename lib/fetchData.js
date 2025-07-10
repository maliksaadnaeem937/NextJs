import axios from "@lib/axios"; // Your custom Axios instance with baseURL and withCredentials
import { asyncHandler } from "./asyncHandler"; // Your [err, res] pattern wrapper

export const fetchData = async ({ queryKey }) => {
  const [_key, method, url] = queryKey;

  const [error, res] = await asyncHandler(axios[method](url));
  if (!error) return res.data;

  // 🔒 Unauthorized – attempt refresh
  if (error.response?.status === 401) {
    const [refreshError] = await asyncHandler(
      axios.post("/auth/refresh", null, {
        validateStatus: (status) => status < 400, // only treat < 400 as success
      })
    );

    // ✅ Refresh succeeded – retry original request
    if (!refreshError) {
      const [retryError, retryRes] = await asyncHandler(axios[method](url));
      if (!retryError) return retryRes.data;
    }

    await asyncHandler(axios.post("/auth/logout"));
    if (
      refreshError?.response?.status === 401 ||
      refreshError?.response?.status === 403
    ) {
      window.location.href = "/login";
      return new Promise(() => {});
    }
  }

  throw new Error(error?.response?.data?.error || "Server side error!");
};

// const fetchProfileForInterceptor = async () => {
//   const [error, res] = await asyncHandler(axios.get("/protected/profile"));
//   if (error) throw error;
//   return res.data;
// };
