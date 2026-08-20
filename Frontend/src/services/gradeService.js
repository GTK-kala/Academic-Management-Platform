const BASE_URL = "http://localhost:3001";

export const Add_Grade = async (gradeData) => {
  console.log(gradeData);
  try {
    const res = await fetch(`${BASE_URL}/grade/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gradeData),
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
