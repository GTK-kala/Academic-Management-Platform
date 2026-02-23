import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import userService from "../../services/userService";
import DataTable from "../../components/common/DataTable";
import UserModal from "../../components/forms/UserModal";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";
import { PlusIcon } from "@heroicons/react/24/outline";

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ role: "", status: "", search: "" });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Determine if current user is super admin
  const isSuperAdmin = currentUser?.role === "super_admin";

  // Define which roles are manageable based on current user's role
  const manageableRoles = isSuperAdmin
    ? ["super_admin", "admin", "teacher", "student", "accountant"]
    : ["teacher", "student"]; // Admin can only manage teachers and students

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers(filters);
      // Filter based on manageable roles
      const filtered = data.filter((u) => manageableRoles.includes(u.role));
      setUsers(filtered);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const handleCreateUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await userService.deleteUser(userToDelete.id);
      fetchUsers();
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  const handleSubmitUser = async (userData) => {
    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, userData);
      } else {
        await userService.createUser(userData);
      }
      fetchUsers();
      setIsModalOpen(false);
    } catch (err) {
      setError(editingUser ? "Failed to update user" : "Failed to create user");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ role: "", status: "", search: "" });
  };

  const columns = [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (value) => (
        <span className="capitalize">{value.replace("_", " ")}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            value === "active"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          User Management
        </h1>
        <button
          onClick={handleCreateUser}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add User
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search by name or email"
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <select
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Roles</option>
            {manageableRoles.map((role) => (
              <option key={role} value={role}>
                {role.replace("_", " ").toUpperCase()}
              </option>
            ))}
          </select>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={clearFilters}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <DataTable
        columns={columns}
        data={users}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        actions={true}
      />

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitUser}
        user={editingUser}
        title={editingUser ? "Edit User" : "Create New User"}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default UserManagement;
