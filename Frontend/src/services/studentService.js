import api from "./api";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
import toast from "react-hot-toast";

const Add_Student = async (studentData) => {
  try {
    const res = await fetch(`${BASE_URL}/students/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
    toast.error("An error occurred while adding the student");
  }
};

export { Add_Student };
