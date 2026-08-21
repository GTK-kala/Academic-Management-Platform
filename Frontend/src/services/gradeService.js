const BASE_URL = "http://localhost:3001";

export const Add_Grade = async (gradeData) => {
  try {
    const res = await fetch(`${BASE_URL}/grades/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gradeData),
    });
    if (!res.ok) {
      throw new Error("Failed to fetch grade");
    } else {
      const data = await res.json();
      return data;
    }
  } catch (error) {
    console.error("Error fetching grade:", error);
    throw error;
  }
};

export const Fetch_Grade = async () => {
  try {
    const res = await fetch(`${BASE_URL}/grades/grade`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to add grade");
    } else {
      const data = await res.json();
      return data;
    }
  } catch (error) {
    console.error("Error adding grade:", error);
    throw error;
  }
};
