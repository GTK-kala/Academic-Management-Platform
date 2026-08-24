import toast from "react-hot-toast";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const Add_Student = async (studentData) => {
  try {
    const res = await fetch(`${BASE_URL}/students/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
      credentials: "include",
    });
    if (!res.ok) {
      const errorData = await res.json();
      toast.error(errorData.message || "Failed to add student");
    } else {
      const data = await res.json();
      toast.success(data.message || "Student added successfully");
    }
  } catch (error) {
    console.error("Error adding student:", error);
    toast.error("An error occurred while adding the student.");
  }
};

export const fetchRecentStudents = async (userId, userRole) => {
  try {
    const res = await fetch(
      `${BASE_URL}/students/all/${userId}?userRole=${userRole}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );
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

export const Fetch_Student = async (studentId, userRole) => {
  try {
    const res = await fetch(
      `${BASE_URL}/students/student/${studentId}?userRole=${userRole}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );
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
