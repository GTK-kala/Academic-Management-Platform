import api from "./api";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
import toast from "react-hot-toast";

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
      console.log(data);
      toast.success(data.message || "Student added successfully");
    }
  } catch (error) {
    console.log(error);
    toast.error("An error occurred while adding the student");
  }
};

export default Add_Student;
