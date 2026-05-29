const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const fetchRecentStudents = async () => {
  try {
    const res = await fetch(`${BASE_URL}/students/recent`, {
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
      const responseData = await res.json();
      return responseData;
    }
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

const api = async () => {};

export default api;
