import axios from "@lib/axios";
import toast from "react-hot-toast";
import { requestWithRefresh } from "./requestWithRefresh";

export async function updateProfile(data, isFormData = false, path) {
  const toastId = toast.loading("Updating ...");

  const url = path || "/protected/profile";
  const config = {
    method: "patch",
    url,
    data,
    ...(isFormData && {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  };

  try {
    const res = await requestWithRefresh(config);
    if (res.status === 200) {
      toast.success(res.data?.message || "Updation successful! ✅", {
        id: toastId,
      });
      return true;
    } else {
      toast.error(res.data?.error || "Updation Failed. Try again.", {
        id: toastId,
      });
    }
  } catch (error) {
    if (error.response) {
      toast.error(error.response.data?.error || "Updation failed.", {
        id: toastId,
      });
    } else if (error.request) {
      toast.error("No response from server. Try again later.", {
        id: toastId,
      });
    } else {
      toast.error("Unexpected error occurred.", { id: toastId });
    }
  }

  return false;
}
