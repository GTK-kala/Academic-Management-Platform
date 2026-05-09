import api from "./api";

const studentService = {
  getAll: async () => {
    const data = await api.get("/students");
    return data.students; // assuming API returns { students: [...] }
  },
  getById: async (id) => {
    const data = await api.get(`/students/${id}`);
    return data.student;
  },
  create: async (studentData) => {
    const data = await api.post("/students", studentData);
    return data.student;
  },
  update: async (id, studentData) => {
    const data = await api.put(`/students/${id}`, studentData);
    return data.student;
  },
  delete: async (id) => {
    await api.delete(`/students/${id}`);
  },
};

export default studentService;
