const BASE_URL = "http://localhost:3001";

export const Add_Grade = async (gradeData, userRole) => {
  try {
    const res = await fetch(`${BASE_URL}/grades/add?userRole=${userRole}`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify(gradeData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to add grade");
    }

    return data;
  } catch (error) {
    console.error("Error adding grade:", error);
    throw error;
  }
};

// ================================
// GET OVERALL GRADE
// ================================
export const Fetch_Overall_Grade = async (studentId, courseId) => {
  try {
    const res = await fetch(
      `${BASE_URL}/grades/overall/${studentId}/${courseId}`,
      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",
      },
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch overall grade");
    }

    return data;
  } catch (error) {
    console.error("Error fetching overall grade:", error);

    throw error;
  }
};

export const Fetch_ALL_Grades = async (userId, userRole) => {
  try {
    const res = await fetch(
      `${BASE_URL}/grades/grade/${userId}?userRole=${userRole}`,
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

export const Fetch_Grade_By_Student = async (studentId, userRole, userId) => {
  try {
    if (userRole === "admin") {
      const res = await fetch(
        `${BASE_URL}/grades/grade/student/${studentId}?userRole=${userRole}`,
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
    } else {
      const res = await fetch(
        `${BASE_URL}/grades/grade/student/${studentId}?userRole=${userRole}&userId=${userId}`,
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
    }
  } catch (error) {
    console.error("Error adding grade:", error);
    throw error;
  }
};

export const Fetch_Grade_By_Course = async (courseId, userRole, userId) => {
  try {
    const res = await fetch(
      `${BASE_URL}/grades/grade/course/${courseId}?userRole=${userRole}&useId${userId}`,
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

export const Fetch_Grade_By_Both = async (courseId, studentId, userRole) => {
  try {
    const res = await fetch(
      `${BASE_URL}/grades/grade/course/${courseId}/student/${studentId}?userRole=${userRole}`,
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
