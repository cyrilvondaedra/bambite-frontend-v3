export async function fetchMenuItem(id: string | null, params: string) {
  try {
    const baseURL = `${process.env.NEXT_PUBLIC_BASE_URL}/products/`;
    const url = `${id ? `${baseURL}${id}` : `${params ? `${baseURL}?search=${params}` : `${baseURL}`}`}`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    console.log("r", response);

    if (!response.ok) {
      throw new Error(`Failed to fetch menu item: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching menu item:", error);
    throw error;
  }
}
