const BASE_URL = "http://localhost:3001";

export const Add_Grade = async (gradeData) => {
  console.log(gradeData);
  try {
    const response = await fetch(`${BASE_URL}/grade/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gradeData),
    });
    if (!response.ok) {
      throw new Error("Failed to add grade");
    }
    return await response.json();
  } catch (error) {
    console.error("Error adding grade:", error);
    throw error;
  }
};
