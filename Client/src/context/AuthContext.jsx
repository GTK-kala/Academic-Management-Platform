import React, { createContext, useReducer, useContext, useEffect } from "react";
import apiClient from "../services/apiClient";

const AuthContext = createContext();

// Toggle this to false when backend is ready
const USE_MOCK = true;

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: true,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case "LOGIN_FAIL":
    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case "USER_LOADED":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case "SET_LOADING":
      return { ...state, loading: true };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.token) {
      loadUser();
    } else {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const loadUser = async () => {
    try {
      if (USE_MOCK) {
        // Mock user data
        setTimeout(() => {
          dispatch({
            type: "USER_LOADED",
            payload: {
              id: 1,
              name: "Admin User",
              email: "admin@example.com",
              role: "admin",
            },
          });
        }, 500);
      } else {
        const userData = await apiClient.get("/auth/me");
        dispatch({ type: "USER_LOADED", payload: userData });
      }
    } catch (err) {
      dispatch({ type: "LOGOUT", payload: "Session expired" });
    }
  };

  const login = async (email, password) => {
    try {
      if (USE_MOCK) {
        // Mock login
        if (email === "admin@example.com" && password === "password") {
          const mockUser = { id: 1, name: "Admin User", email, role: "admin" };
          const mockToken = "fake-jwt-token";
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: { user: mockUser, token: mockToken },
          });
          return { success: true, user: mockUser };
        }
        return { success: false, error: "Invalid credentials" };
      } else {
        // Real API call
        const data = await apiClient.post("/auth/login", { email, password });
        // Assuming data contains { token, user }
        dispatch({ type: "LOGIN_SUCCESS", payload: data });
        return { success: true, user: data.user };
      }
    } catch (error) {
      dispatch({ type: "LOGIN_FAIL", payload: error });
      return { success: false, error };
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
