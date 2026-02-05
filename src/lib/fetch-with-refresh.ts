import { getAccessToken, clearTokens } from "./auth-token";
import { refreshAuthToken } from "./api-client";

export async function fetchWithAccessRefresh(
  url: string,
  init: RequestInit = {}
): Promise<Response> {
  const accessToken = getAccessToken();

  const doFetch = (token?: string) =>
    fetch(url, {
      ...init,
      headers: {
        ...(init.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      // keep cookies if your backend also relies on them
      credentials: "include",
    });

  let res = await doFetch(accessToken ?? undefined);

  if (res.status !== 401) return res;

  // 401 -> refresh once -> retry once
  const newToken = await refreshAuthToken();
  if (!newToken) {
    clearTokens();
    return res; // still 401
  }

  return doFetch(newToken);
}
