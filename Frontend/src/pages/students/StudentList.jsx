import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../../components/common/Button";
import { FiPlus, FiSearch, FiEdit2, FiTrash2 } from "react-icons/fi";
import { Fetch_Students, Delete_Student } from "../../services/studentService";

const StudentList = () => {
  const [student, setStudent] = useState([]);
  const [deleteId, setDeleteId] = useState(0);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchStudents = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await Fetch_Students(user?.userId, user?.role);
      setStudents(response.students || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async () => {
    setDeleteLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const res = await Delete_Student(deleteId, user?.role);
      setStudents(students.filter((s) => s.id !== deleteId));
    } catch (err) {
      toast.error("Failed to delete student");
      setShowDeleteModal(false);
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
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
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
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
        <FiSearch className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-3 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-dark-border dark:bg-dark-bg dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-xl dark:border-dark-border">
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
                    <td className="flex gap-2 px-6 py-4">
                      <Link
                        to={`/students/${student.id}`}
                        className="text-primary hover:text-primary-dark"
                      >
                        <FiEdit2 size={18} />
                      </Link>
                      <button
                        onClick={() => {
                          (setDeleteId(student.id), setShowDeleteModal(true));
                        }}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 dark:border-dark-border">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Delete Student
              </h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete{" "}
                <strong>
                  {student?.first_name} {student?.last_name}
                </strong>
                ? This action cannot be undone and will remove all associated
                records.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete()}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Deleting..." : "Delete Student"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
