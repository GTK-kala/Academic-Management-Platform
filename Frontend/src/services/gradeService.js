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

export const Fetch_ALL_Grades = async () => {
  console.log("Hello1");
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

export const Fetch_Grade_By_Student = async (studentId) => {
  console.log("Hello2");
  try {
    const res = await fetch(`${BASE_URL}/grades/grade/student/${studentId}`, {
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

export const Fetch_Grade_By_Course = async (courseId) => {
  console.log("Hello3");
  try {
    const res = await fetch(`${BASE_URL}/grades/grade/course/${courseId}`, {
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

export const Fetch_Grade_By_Both = async (courseId, studentId) => {
  console.log("Hello4");
  try {
    const res = await fetch(
      `$${BASE_URL}/grades/grade/course/${courseId}/student/${studentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );
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
