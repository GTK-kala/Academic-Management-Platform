const BASE_URL = "http://localhost:3001";

export const Add_Course = async (courseData) => {
  try {
    const res = await fetch(`${BASE_URL}/courses/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(courseData),
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to add course");
    } else {
      const data = await res.json();
      console.log(data);
    }
  } catch (error) {
    console.error("Error adding course:", error);
    throw error;
  }
};

export const Get_Courses = async (role) => {
  try {
    const res = await fetch(`${BASE_URL}/courses/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch courses");
    } else {
      const data = await res.json();
      return data;
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

export const Enroll_Course = async (courseId, studentId) => {
  try {
    const res = await fetch(`${BASE_URL}/enrollments/enroll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ courseId, studentId }),
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to enroll in course");
    } else {
      const data = await res.json();
      console.log(data);
    }
  } catch (error) {
    console.error("Error enrolling in course:", error);
    throw error;
  }
};

export const Get_Course = async (courseId) => {
  try {
    const res = await fetch(`${BASE_URL}/courses/detail/${courseId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch course details");
    } else {
      const data = await res.json();
      return data;
    }
  } catch (error) {
    console.error("Error fetching course details:", error);
    throw error;
  }
};

const Enrolled_Courses = async (studentId) => {
  try {
    const res = await fetch(`${BASE_URL}/enrollments/enrolled/${studentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch enrolled courses");
    } else {
      const data = await res.json();
      return data;
    }
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    throw error;
  }
};
