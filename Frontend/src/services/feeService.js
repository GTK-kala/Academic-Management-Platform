const BASE_URL = import.meta.env.VITE_API_URL;

export const Get_Fee_Structure = async () => {
  try {
    const response = await fetch(`${BASE_URL}/fees/structure`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch fee structures");
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching fee structures:", error);
    throw error;
  }
};
