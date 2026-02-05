import { clearTokens, getRefreshToken, setTokens } from "./auth-token";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL!;

function isRestaurantTableRouteSafe(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.pathname.includes("/restaurant/table/");
}

export async function refreshAuthToken(): Promise<string | null> {
  if (!baseURL) return null;

  // keep your special-case behavior
  if (isRestaurantTableRouteSafe()) return null;

  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const res = await fetch(`${baseURL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // If your refresh uses cookies only, remove body and keep credentials: "include"
    body: JSON.stringify({ refreshToken }),
    credentials: "include", // keep if you also use cookie refresh
  });

  if (!res.ok) {
    if (res.status === 401) {
      clearTokens();
      return null;
    }
    return null;
  }

  const json = await res.json().catch(() => null) as any;

  const newAccessToken =
    json?.data?.accessToken ?? json?.accessToken ?? json?.data?.tokens?.accessToken;

  const newRefreshToken =
    json?.data?.refreshToken ?? json?.refreshToken ?? json?.data?.tokens?.refreshToken;

  if (!newAccessToken) {
    // if backend doesn't return tokens, you can't do localStorage-based access token auth
    return null;
  }

  setTokens({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  return newAccessToken;
}
