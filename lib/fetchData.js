import { requestWithRefresh } from "./requestWithRefresh";

export const fetchData = async ({ queryKey }) => {
  const [_key, method, url, data] = queryKey;

  const config = {
    method,
    url,
    ...(data && { data }),
  };

  const res = await requestWithRefresh(config);
  return res.data;
};
