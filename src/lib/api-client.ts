const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";

// Centralized refresh function that can be used by both api-client and auth-context
export const refreshAuthToken = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${baseURL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    });
    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    return true;
  } catch (error) {
    // Redirect to login
    // if (typeof window !== "undefined") {
    //   window.location.href = "/login";
    // }
    throw error;
  }
};
