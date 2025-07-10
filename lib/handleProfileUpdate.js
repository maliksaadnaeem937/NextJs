import toast from "react-hot-toast";
import { asyncHandler } from "./asyncHandler";
import axios from "@lib/axios";
export async function updateProfile(data, isFormData = false, path) {
  const toastId = toast.loading("Updating ...");
  const config = isFormData
    ? { headers: { "Content-Type": "multipart/form-data" } }
    : {}; // For JSON

  const url = path || "/protected/profile";
  const [error, res] = await asyncHandler(axios.patch(url, data, config));

  if (error) {
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
  } else {
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
  }
  return false;
}
