import api from "./api";
import toast from "react-hot-toast";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const Add_Student = async (studentData) => {
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
      console.log(errorData);
      toast.error(errorData.message || "Failed to add student");
    } else {
      const data = await res.json();
      console.log(studentData);
      toast.success(data.message || "Student added successfully");
    }
  } catch (error) {
    console.error("Error adding student:", error);
    toast.error("An error occurred while adding the student.");
  }
};

export default Add_Student;
