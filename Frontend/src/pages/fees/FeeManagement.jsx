import { useState, useEffect } from "react";
import {
  FiDollarSign,
  FiPlus,
  FiSearch,
  FiDownload,
  FiEye,
  FiCreditCard,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiTrendingUp,
  FiTrendingDown,
  FiFilter,
  FiCalendar,
  FiBook,
  FiUser,
} from "react-icons/fi";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { Get_Courses } from "../../services/courseService";
import { Get_Fee_Structure } from "../../services/feeService";

const FeeManagement = () => {
  const { user } = useAuth();

  // State management
  const [feeStructures, setFeeStructures] = useState([]);
  const [filteredStructures, setFilteredStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [courses, setCourses] = useState([]);

  // Modal states
  const [showAddFeeModal, setShowAddFeeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);

  // Form states
  const [feeForm, setFeeForm] = useState({
    course_id: "",
    fee_name: "",
    amount: "",
    due_date: "",
    academic_session: "2025-Spring",
  });

  const [paymentForm, setPaymentForm] = useState({
    student_id: "",
    fee_structure_id: "",
    amount_paid: "",
    payment_method: "cash",
  });

  // Success/Error messages
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Load initial data
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    fetchFeeStructures(user?.userId, user?.role);
    fetchCourses();
  }, []);

  // Filter effect
  useEffect(() => {
    filterStructures();
  }, [searchTerm, filterStatus, selectedCourse, feeStructures]);

  // Mock data for demonstration - Replace with API call
  const fetchFeeStructures = async (userId, role) => {
    setLoading(true);
    try {
      const FeeData = await Get_Fee_Structure(userId, role);
      const FeeStructures = FeeData.fee_structure || [];
      setFeeStructures(FeeStructures);
      setFilteredStructures(FeeStructures);
    } catch (error) {
      console.error("Failed to fetch fee structures:", error);
      setErrorMessage("Failed to load fee structures");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const CourseData = await Get_Courses();
      const courses = CourseData.courses || [];
      setCourses(courses);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  // Filter fee structures
  const filterStructures = () => {
    let filtered = feeStructures;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (fee) =>
          fee.fee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fee.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fee.course_code.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((fee) => {
        const collectionRate =
          (fee.total_collected / fee.amount) * fee.total_students * 100;
        if (filterStatus === "active") return collectionRate < 100;
        if (filterStatus === "completed") return collectionRate >= 100;
        return true;
      });
    }

    // Filter by course
    if (selectedCourse !== "all") {
      filtered = filtered.filter(
        (fee) => fee.course_id === parseInt(selectedCourse),
      );
    }

    setFilteredStructures(filtered);
  };

  // Handle form inputs
  const handleFeeFormChange = (e) => {
    const { name, value } = e.target;
    setFeeForm({ ...feeForm, [name]: value });
  };

  const handlePaymentFormChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm({ ...paymentForm, [name]: value });
  };

  // Add new fee structure
  const handleAddFee = async (e) => {
    e.preventDefault();

    // Validate
    if (
      !feeForm.course_id ||
      !feeForm.fee_name ||
      !feeForm.amount ||
      !feeForm.due_date
    ) {
      setErrorMessage("Please fill in all required fields");
      return;
    }

    try {
      // TODO: Replace with actual API call
      // await api.post('/fees/structures', feeForm);

      // Add to local state (mock)
      const newFee = {
        id: feeStructures.length + 1,
        ...feeForm,
        course_code:
          courses.find((c) => c.id === parseInt(feeForm.course_id))
            ?.course_code || "",
        course_name:
          courses.find((c) => c.id === parseInt(feeForm.course_id))
            ?.course_name || "",
        total_collected: 0,
        total_students: 0,
        paid_students: 0,
        status: "active",
      };

      setFeeStructures([newFee, ...feeStructures]);
      setShowAddFeeModal(false);
      setSuccessMessage("Fee structure created successfully!");

      // Reset form
      setFeeForm({
        course_id: "",
        fee_name: "",
        amount: "",
        due_date: "",
        academic_session: "2025-Spring",
      });

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Failed to create fee structure");
    }
  };

  // Record payment
  const handlePayment = async (e) => {
    e.preventDefault();

    // Validate
    if (!paymentForm.student_id || !paymentForm.amount_paid) {
      setErrorMessage("Please fill in all required fields");
      return;
    }

    try {
      // TODO: Replace with actual API call
      // await api.post('/fees/payments', paymentForm);

      setShowPaymentModal(false);
      setSuccessMessage("Payment recorded successfully!");

      // Reset form
      setPaymentForm({
        student_id: "",
        fee_structure_id: "",
        amount_paid: "",
        payment_method: "cash",
      });

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Failed to record payment");
    }
  };

  // Open payment modal
  const openPaymentModal = (fee) => {
    setSelectedFee(fee);
    setPaymentForm({
      ...paymentForm,
      fee_structure_id: fee.id,
      amount_paid: fee.amount,
    });
    setShowPaymentModal(true);
  };

  // Calculate collection rate
  const calculateCollectionRate = (fee) => {
    const totalExpected = fee.amount * fee.total_students;
    if (totalExpected === 0) return 0;
    return Math.round((fee.total_collected / totalExpected) * 100);
  };

  // Get status badge
  const getStatusBadge = (rate) => {
    if (rate >= 100) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
          Completed
        </span>
      );
    } else if (rate >= 50) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
          In Progress
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">
          Low Collection
        </span>
      );
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary dark:text-white">
            Fee Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {user?.role === "admin"
              ? "Manage fee structures and track collections"
              : "View your fees and make payments"}
          </p>
        </div>
        {user?.role === "admin" && (
          <Button
            onClick={() => setShowAddFeeModal(true)}
            className="flex items-center gap-2"
          >
            <FiPlus /> Add Fee Structure
          </Button>
        )}
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400 flex items-center gap-2">
          <FiCheckCircle className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 flex items-center gap-2">
          <FiAlertCircle className="w-5 h-5" />
          {errorMessage}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
              <FiDollarSign className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Total Fees
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                $
                {feeStructures
                  .reduce((sum, f) => sum + f.amount * f.total_students, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <FiTrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Collected
              </p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                $
                {feeStructures
                  .reduce((sum, f) => sum + f.total_collected, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
              <FiTrendingDown className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Pending
              </p>
              <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                $
                {feeStructures
                  .reduce(
                    (sum, f) =>
                      sum + (f.amount * f.total_students - f.total_collected),
                    0,
                  )
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <FiCheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Collection Rate
              </p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {(() => {
                  const totalExpected = feeStructures.reduce(
                    (sum, f) => sum + f.amount * f.total_students,
                    0,
                  );
                  const totalCollected = feeStructures.reduce(
                    (sum, f) => sum + f.total_collected,
                    0,
                  );
                  return totalExpected > 0
                    ? Math.round((totalCollected / totalExpected) * 100)
                    : 0;
                })()}
                %
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search fee structures..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
            />
          </div>

          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.course_code} - {course.course_name}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="active">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Fee Structures Table */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-dark-bg">
              <tr className="text-sm font-medium text-gray-500 dark:text-gray-400">
                <th className="px-6 py-4">Fee Name</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Collection Progress</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-dark-border">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                  </td>
                </tr>
              ) : filteredStructures.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    <FiDollarSign className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    No fee structures found
                  </td>
                </tr>
              ) : (
                filteredStructures.map((fee) => {
                  const collectionRate = calculateCollectionRate(fee);
                  return (
                    <tr
                      key={fee.id}
                      className="hover:bg-gray-50 dark:hover:bg-dark-card/50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {fee.fee_name}
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {fee.academic_session}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {fee.course_code}
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {fee.course_name}
                        </p>
                      </td>
                      <td className="px-6 py-4 font-semibold text-primary dark:text-primary-300">
                        ${fee.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {new Date(fee.due_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-32">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500 dark:text-gray-400">
                              {fee.paid_students}/{fee.total_students} students
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {collectionRate}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                collectionRate >= 100
                                  ? "bg-green-500"
                                  : collectionRate >= 50
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                              style={{ width: `${collectionRate}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(collectionRate)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openPaymentModal(fee)}
                            className="p-2 text-primary hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                            title="Record Payment"
                          >
                            <FiCreditCard className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-lg transition-colors"
                            title="View Details"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Fee Structure Modal */}
      {showAddFeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-dark-border flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add Fee Structure
              </h3>
              <button
                onClick={() => setShowAddFeeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFee} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Course <span className="text-red-500">*</span>
                </label>
                <select
                  name="course_id"
                  value={feeForm.course_id}
                  onChange={handleFeeFormChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.course_code} - {course.course_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fee Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fee_name"
                  value={feeForm.fee_name}
                  onChange={handleFeeFormChange}
                  required
                  placeholder="e.g., Tuition Fee, Lab Fee"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={feeForm.amount}
                    onChange={handleFeeFormChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="due_date"
                    value={feeForm.due_date}
                    onChange={handleFeeFormChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Academic Session
                </label>
                <input
                  type="text"
                  name="academic_session"
                  value={feeForm.academic_session}
                  onChange={handleFeeFormChange}
                  placeholder="e.g., 2025-Spring"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowAddFeeModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Fee Structure</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPaymentModal && selectedFee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200 dark:border-dark-border flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Record Payment
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {/* Fee Details */}
              <div className="bg-gray-50 dark:bg-dark-bg p-4 rounded-lg mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Fee Details
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedFee.fee_name} - {selectedFee.course_name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Amount:{" "}
                  <span className="font-semibold">
                    ${selectedFee.amount.toLocaleString()}
                  </span>
                </p>
              </div>

              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Student ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="student_id"
                    value={paymentForm.student_id}
                    onChange={handlePaymentFormChange}
                    required
                    placeholder="Enter student ID"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount Paid <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="amount_paid"
                    value={paymentForm.amount_paid}
                    onChange={handlePaymentFormChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment Method
                  </label>
                  <select
                    name="payment_method"
                    value={paymentForm.payment_method}
                    onChange={handlePaymentFormChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                  >
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="online">Online Payment</option>
                  </select>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Record Payment</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeManagement;
