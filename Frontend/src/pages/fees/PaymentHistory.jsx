import { useState, useEffect } from "react";
import {
  FiDownload,
  FiSearch,
  FiFilter,
  FiCalendar,
  FiDollarSign,
  FiCreditCard,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiTrendingUp,
  FiTrendingDown,
  FiUser,
  FiBook,
  FiEye,
  FiPrinter,
} from "react-icons/fi";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";

const PaymentHistory = () => {
  const { user } = useAuth();

  // State management
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMethod, setFilterMethod] = useState("all");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Selected payment for detail view
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Load payments
  useEffect(() => {
    fetchPayments();
  }, []);

  // Filter effect
  useEffect(() => {
    filterPayments();
  }, [searchTerm, filterStatus, filterMethod, dateRange, payments]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/fees/payments');
      // setPayments(response.data?.payments || []);

      // Mock data
      const mockPayments = [
        {
          id: 1,
          student_id: 101,
          student_name: "John Doe",
          course_name: "Introduction to Programming",
          fee_name: "Tuition Fee",
          amount_paid: 2500,
          total_due: 5000,
          balance: 2500,
          payment_date: "2025-05-12",
          payment_method: "credit_card",
          status: "partial",
          receipt_no: "RCP-2025-001",
        },
        {
          id: 2,
          student_id: 102,
          student_name: "Jane Smith",
          course_name: "Calculus II",
          fee_name: "Tuition Fee",
          amount_paid: 4500,
          total_due: 4500,
          balance: 0,
          payment_date: "2025-05-10",
          payment_method: "bank_transfer",
          status: "paid",
          receipt_no: "RCP-2025-002",
        },
        {
          id: 3,
          student_id: 103,
          student_name: "Mike Johnson",
          course_name: "Physics I",
          fee_name: "Lab Fee",
          amount_paid: 1500,
          total_due: 1500,
          balance: 0,
          payment_date: "2025-05-08",
          payment_method: "cash",
          status: "paid",
          receipt_no: "RCP-2025-003",
        },
        {
          id: 4,
          student_id: 104,
          student_name: "Sarah Williams",
          course_name: "English Composition",
          fee_name: "Tuition Fee",
          amount_paid: 0,
          total_due: 3500,
          balance: 3500,
          payment_date: null,
          payment_method: null,
          status: "pending",
          receipt_no: "RCP-2025-004",
        },
        {
          id: 5,
          student_id: 105,
          student_name: "David Brown",
          course_name: "Introduction to Programming",
          fee_name: "Lab Fee",
          amount_paid: 500,
          total_due: 1000,
          balance: 500,
          payment_date: "2025-05-05",
          payment_method: "online",
          status: "partial",
          receipt_no: "RCP-2025-005",
        },
        {
          id: 6,
          student_id: 106,
          student_name: "Emily Davis",
          course_name: "Chemistry I",
          fee_name: "Tuition Fee",
          amount_paid: 0,
          total_due: 4800,
          balance: 4800,
          payment_date: null,
          payment_method: null,
          status: "overdue",
          receipt_no: "RCP-2025-006",
        },
        {
          id: 7,
          student_id: 107,
          student_name: "Michael Wilson",
          course_name: "Biology I",
          fee_name: "Lab Fee",
          amount_paid: 800,
          total_due: 1200,
          balance: 400,
          payment_date: "2025-05-03",
          payment_method: "cash",
          status: "partial",
          receipt_no: "RCP-2025-007",
        },
        {
          id: 8,
          student_id: 108,
          student_name: "Lisa Anderson",
          course_name: "Mathematics II",
          fee_name: "Tuition Fee",
          amount_paid: 4200,
          total_due: 4200,
          balance: 0,
          payment_date: "2025-05-01",
          payment_method: "credit_card",
          status: "paid",
          receipt_no: "RCP-2025-008",
        },
      ];

      setPayments(mockPayments);
      setFilteredPayments(mockPayments);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = () => {
    let filtered = payments;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.student_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          payment.course_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          payment.fee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.receipt_no.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((payment) => payment.status === filterStatus);
    }

    // Filter by payment method
    if (filterMethod !== "all") {
      filtered = filtered.filter(
        (payment) => payment.payment_method === filterMethod,
      );
    }

    // Filter by date range
    if (dateRange.startDate) {
      filtered = filtered.filter(
        (payment) =>
          payment.payment_date && payment.payment_date >= dateRange.startDate,
      );
    }
    if (dateRange.endDate) {
      filtered = filtered.filter(
        (payment) =>
          payment.payment_date && payment.payment_date <= dateRange.endDate,
      );
    }

    setFilteredPayments(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = filteredPayments.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate statistics
  const calculateStats = () => {
    const totalCollected = payments
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.amount_paid, 0);

    const totalPartial = payments
      .filter((p) => p.status === "partial")
      .reduce((sum, p) => sum + p.amount_paid, 0);

    const totalPending = payments
      .filter((p) => p.status === "pending" || p.status === "overdue")
      .reduce((sum, p) => sum + p.balance, 0);

    return {
      totalCollected,
      totalPartial,
      totalPending,
      totalTransactions: payments.filter((p) => p.amount_paid > 0).length,
    };
  };

  const stats = calculateStats();

  // Get status badge
  const getStatusBadge = (status) => {
    const statusStyles = {
      paid: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      partial:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
      pending:
        "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
      overdue: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[status] || ""}`}
      >
        {status}
      </span>
    );
  };

  // Get payment method icon
  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "cash":
        return "💵";
      case "bank_transfer":
        return "🏦";
      case "credit_card":
        return "💳";
      case "online":
        return "🌐";
      default:
        return "💰";
    }
  };

  // Open detail modal
  const openDetailModal = (payment) => {
    setSelectedPayment(payment);
    setShowDetailModal(true);
  };

  // Export to CSV (mock)
  const handleExport = () => {
    const csvContent = [
      [
        "Receipt No",
        "Student",
        "Course",
        "Fee",
        "Amount Paid",
        "Balance",
        "Date",
        "Method",
        "Status",
      ],
      ...filteredPayments.map((p) => [
        p.receipt_no,
        p.student_name,
        p.course_name,
        p.fee_name,
        p.amount_paid,
        p.balance,
        p.payment_date || "N/A",
        p.payment_method || "N/A",
        p.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payment_history.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary dark:text-white">
            Payment History
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            View and track all payment transactions
          </p>
        </div>
        <Button onClick={handleExport} className="flex items-center gap-2">
          <FiDownload className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <FiCheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Fully Paid
              </p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                ${stats.totalCollected.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
              <FiClock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Partially Paid
              </p>
              <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                ${stats.totalPartial.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <FiAlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Pending/Overdue
              </p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">
                ${stats.totalPending.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <FiCreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Transactions
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.totalTransactions}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student, course, or receipt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>

          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Methods</option>
            <option value="cash">Cash</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="credit_card">Credit Card</option>
            <option value="online">Online</option>
          </select>

          <div className="flex gap-2">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, startDate: e.target.value })
              }
              className="px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white text-sm"
            />
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, endDate: e.target.value })
              }
              className="px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white text-sm"
            />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-dark-bg">
              <tr className="text-sm font-medium text-gray-500 dark:text-gray-400">
                <th className="px-6 py-4">Receipt No</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Fee Name</th>
                <th className="px-6 py-4">Amount Paid</th>
                <th className="px-6 py-4">Balance</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-dark-border">
              {loading ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                  </td>
                </tr>
              ) : currentPayments.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    <FiDollarSign className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    No payment records found
                  </td>
                </tr>
              ) : (
                currentPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-50 dark:hover:bg-dark-card/50"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-gray-600 dark:text-gray-300">
                      {payment.receipt_no}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {payment.student_name}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {payment.course_name}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {payment.fee_name}
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-600 dark:text-green-400">
                      ${payment.amount_paid.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      ${payment.balance.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {payment.payment_date
                        ? new Date(payment.payment_date).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 capitalize">
                      {payment.payment_method ? (
                        <span className="flex items-center gap-1">
                          <span>
                            {getPaymentMethodIcon(payment.payment_method)}
                          </span>
                          {payment.payment_method.replace("_", " ")}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openDetailModal(payment)}
                        className="p-2 text-primary hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredPayments.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-dark-border flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredPayments.length)} of{" "}
              {filteredPayments.length} results
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 dark:border-dark-border rounded-lg text-sm text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-dark-bg"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      currentPage === page
                        ? "bg-primary text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-bg"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 dark:border-dark-border rounded-lg text-sm text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-dark-bg"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Detail Modal */}
      {showDetailModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200 dark:border-dark-border flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Payment Details
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {/* Receipt Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiCreditCard className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedPayment.receipt_no}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedPayment.payment_date
                    ? new Date(
                        selectedPayment.payment_date,
                      ).toLocaleDateString()
                    : "Pending"}
                </p>
              </div>

              {/* Payment Info */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-border">
                  <span className="text-gray-500 dark:text-gray-400">
                    Student
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {selectedPayment.student_name}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-border">
                  <span className="text-gray-500 dark:text-gray-400">
                    Course
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {selectedPayment.course_name}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-border">
                  <span className="text-gray-500 dark:text-gray-400">
                    Fee Name
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {selectedPayment.fee_name}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-border">
                  <span className="text-gray-500 dark:text-gray-400">
                    Total Due
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${selectedPayment.total_due.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-border">
                  <span className="text-gray-500 dark:text-gray-400">
                    Amount Paid
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    ${selectedPayment.amount_paid.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-border">
                  <span className="text-gray-500 dark:text-gray-400">
                    Balance
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${selectedPayment.balance.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500 dark:text-gray-400">
                    Payment Method
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {selectedPayment.payment_method
                      ? selectedPayment.payment_method.replace("_", " ")
                      : "N/A"}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="mb-6">
                {getStatusBadge(selectedPayment.status)}
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <Button
                  variant="secondary"
                  onClick={() => window.print()}
                  className="flex items-center gap-2"
                >
                  <FiPrinter className="w-4 h-4" /> Print Receipt
                </Button>
                <Button onClick={() => setShowDetailModal(false)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
