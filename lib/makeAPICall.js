import toast from "react-hot-toast";
import { requestWithRefresh } from "./requestWithRefresh";

export const makeAPICall = async ({ queryKey }) => {
  const [_key, method, url, data] = queryKey;

  const config = {
    method,
    url,
    ...(data && { data }),
  };

  const res = await requestWithRefresh(config);
  return res.data;
};
