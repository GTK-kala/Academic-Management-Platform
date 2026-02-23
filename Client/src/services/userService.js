import apiClient from "./apiClient";

// Toggle this to false when backend is ready
const USE_MOCK = true;

// Mock data
const MOCK_USERS = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "teacher",
    status: "active",
    createdAt: "2024-01-20",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "student",
    status: "active",
    createdAt: "2024-02-01",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    role: "student",
    status: "inactive",
    createdAt: "2024-02-10",
  },
  {
    id: 5,
    name: "Charlie Wilson",
    email: "charlie@example.com",
    role: "accountant",
    status: "active",
    createdAt: "2024-02-15",
  },
  {
    id: 6,
    name: "Diana Prince",
    email: "diana@example.com",
    role: "super_admin",
    status: "active",
    createdAt: "2024-01-10",
  },
];

// Simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const userService = {
  // Get all users (with optional filters)
  getUsers: async (filters = {}) => {
    if (USE_MOCK) {
      await delay(500);
      let filtered = [...MOCK_USERS];

      // Apply filters
      if (filters.role) {
        filtered = filtered.filter((u) => u.role === filters.role);
      }
      if (filters.status) {
        filtered = filtered.filter((u) => u.status === filters.status);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(
          (u) =>
            u.name.toLowerCase().includes(searchLower) ||
            u.email.toLowerCase().includes(searchLower),
        );
      }

      return filtered;
    }

    // Real API call
    const response = await apiClient.get("/users", { params: filters });
    return response;
  },

  // Get user by ID
  getUserById: async (id) => {
    if (USE_MOCK) {
      await delay(300);
      const user = MOCK_USERS.find((u) => u.id === id);
      if (!user) throw new Error("User not found");
      return user;
    }
    return apiClient.get(`/users/${id}`);
  },

  // Create new user
  createUser: async (userData) => {
    if (USE_MOCK) {
      await delay(500);
      const newUser = {
        id: MOCK_USERS.length + 1,
        ...userData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      MOCK_USERS.push(newUser);
      return newUser;
    }
    return apiClient.post("/users", userData);
  },

  // Update user
  updateUser: async (id, userData) => {
    if (USE_MOCK) {
      await delay(500);
      const index = MOCK_USERS.findIndex((u) => u.id === id);
      if (index === -1) throw new Error("User not found");
      MOCK_USERS[index] = { ...MOCK_USERS[index], ...userData };
      return MOCK_USERS[index];
    }
    return apiClient.put(`/users/${id}`, userData);
  },

  // Delete user
  deleteUser: async (id) => {
    if (USE_MOCK) {
      await delay(500);
      const index = MOCK_USERS.findIndex((u) => u.id === id);
      if (index === -1) throw new Error("User not found");
      MOCK_USERS.splice(index, 1);
      return { success: true };
    }
    return apiClient.delete(`/users/${id}`);
  },
};

export default userService;
