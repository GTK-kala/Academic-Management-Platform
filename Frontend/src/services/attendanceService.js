const BASE_URL = import.meta.env.VITE_API_URL;

export const Get_Attendances = async (courseId, userRole, userId) => {
  console.log(courseId, userRole, userId);
  try {
    if (
      (userRole === "admin" && courseId === "all") ||
      (userRole === "teacher" && courseId === "all") ||
      (userRole === "student" && courseId === "all")
    ) {
      const res = await fetch(
        `${BASE_URL}/attendances/all?userRole=${userRole}&courseId=${courseId}&userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );
      if (!res.ok) {
        throw new Error("Failed to Attendance");
      } else {
        const data = await res.json();
        console.log(data);
        return data;
      }
    } else if (
      (userRole === "admin" && courseId !== "all") ||
      (userRole === "teacher" && courseId !== "all")
    ) {
      const res = await fetch(
        `${BASE_URL}/attendances/all?userRole=${userRole}&courseId=${courseId}&userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );
      if (!res.ok) {
        throw new Error("Failed to Attendance");
      } else {
        const data = await res.json();
        console.log(data);
        return data;
      }
    }
  } catch (error) {
    console.error("Error fetching Attendance:", error);
    throw error;
  }
};

export const Add_Attendance = async (attendanceData) => {
  try {
    const res = fetch(`${BASE_URL}/attendances/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(attendanceData),
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to Attendance");
    } else {
      const data = await res.json();
      console.log(data);
      return data;
    }
  } catch (error) {
    console.error("Error fetching Attendance:", error);
    throw error;
  }
};
