const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const api = async () => {};
let endpoint = "/grades";
const params = [];

if (selectedCourse !== "all") {
  params.push(`course_id=${selectedCourse}`);
}
if (selectedStudent !== "all") {
  params.push(`student_id=${selectedStudent}`);
}

if (params.length > 0) {
  endpoint += `?${params.join("&")}`;
}

const res = await api.get(endpoint);
const gradeData = res.data?.grades || [];

export default api;
