const BASE_URL = import.meta.env.VITE_API_URL;

export const Get_Attendances = async () => {
  try {
    const res = await fetch(`${BASE_URL}/attendance/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to Attendance");
    } else {
      const data = await res.json();
      return data;
    }
  } catch (error) {
    console.error("Error fetching Attendance:", error);
    throw error;
  }
};
