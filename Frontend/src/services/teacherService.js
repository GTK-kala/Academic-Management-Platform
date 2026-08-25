const BASE_URL = import.meta.env.VITE_API_URL;

export const Get_Teachers = async () => {
  try {
    const res = await fetch(`${BASE_URL}/teachers/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "API request failed");
    } else {
      const Data = await res.json();
      return Data;
    }
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};
