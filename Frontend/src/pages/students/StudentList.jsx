import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiSearch, FiEdit2, FiTrash2 } from "react-icons/fi";
import api from "../../services/api";
import Button from "../../components/common/Button";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchStudents = async () => {
    try {
      const data = await api.get("/students");
      setStudents(data.data.students || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await api.delete(`/students/${id}`);
      setStudents(students.filter((s) => s.id !== id));
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  const filtered = students.filter(
    (s) =>
      s.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-primary dark:text-white">
          Students
        </h1>
        <Link to="/students/add">
          <Button className="flex items-center gap-2">
            <FiPlus /> Add Student
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-dark-bg">
              <tr className="text-sm font-medium text-gray-500 dark:text-gray-400">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Enrolled</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-dark-border">
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No students found.
                  </td>
                </tr>
              ) : (
                filtered.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-gray-50 dark:hover:bg-dark-card/50"
                  >
                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                      {student.first_name} {student.last_name}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {new Date(student.enrollment_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <Link
                        to={`/students/${student.id}`}
                        className="text-primary hover:text-primary-dark"
                      >
                        <FiEdit2 size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
