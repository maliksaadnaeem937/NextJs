// @lib/requestWithRefresh.js

import axios from "@lib/axios";
import { asyncHandler } from "./asyncHandler";

export const requestWithRefresh = async (config) => {
  let [error, res] = await asyncHandler(axios(config));
  if (!error) return res;

  // Try refresh token
  if (error.response?.status === 401) {
    const [refreshError] = await asyncHandler(
      axios.post("/auth/refresh", null, {
        validateStatus: (status) => status < 400,
      })
    );

    if (!refreshError) {
      // Retry original request
      [error, res] = await asyncHandler(axios(config));
      if (!error) return res;
    }

    // Logout and redirect
    await asyncHandler(axios.post("/auth/logout"));
    if (
      refreshError?.response?.status === 401 ||
      refreshError?.response?.status === 403
    ) {
      window.location.href = "/login";
      return new Promise(() => {});
    }
    console.log(refreshError);

    throw refreshError;
  }
  console.log(error);
  throw error;
};
