import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("student");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("male");
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [department, setDepartment] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [studentRole, setStudentRole] = useState(false);
  const [teacherRole, setTeacherRole] = useState(false);

  const HandleRole = () => {
    if (role === "student") {
      setStudentRole(true);
      setTeacherRole(true);
    } else if (role === "teacher") {
      setStudentRole(false);
      setTeacherRole(false);
    }
  };

  const handleSubmit = async (e) => {
    const BASE_URL = "http://localhost:3001";
    e.preventDefault();
    setError("");

    if (
      !department ||
      !firstName ||
      !password ||
      !lastName ||
      !gender ||
      !email ||
      !phone ||
      !address
    ) {
      setError("All fields are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const body = {
        role: role,
        email: email,
        phone: phone,
        gender: gender,
        address: address,
        password: password,
        last_name: lastName,
        first_name: firstName,
        department: department,
        dateOfBirth: dateOfBirth,
      };
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to register user");
      } else {
        const data = await res.json();
        navigate("/login");
      }
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-50 dark:bg-dark-bg px-4 py-8">
      <div className="bg-white dark:bg-dark-card p-8 rounded-2xl shadow-xl w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-xl mb-4">
            <span className="text-white text-2xl font-bold">AM</span>
          </div>
          <h2 className="text-3xl font-bold text-primary dark:text-white">
            Create Account
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Join the Student Management System
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role
            </label>
            <select
              name="role"
              value={role}
              onChange={(e) => {
                (setRole(e.target.value), HandleRole());
              }}
              className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="John"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Doe"
              />
            </div>
          </div>

          {/* Department */}
          {teacherRole ? (
            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Department
              </label>
              <select
                id="department"
                name="department"
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Computer Science"
              >
                <option value="It">It</option>
                <option value="Art">Art</option>
                <option value="Maths">Maths</option>
                <option value="Biology">Biology</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Water Engineering">Water Engineering</option>
                <option value="Software engineering">
                  Software Engineering
                </option>
                <option value="Electrical Engineering">
                  Electrical Engineering
                </option>
                <option value="Mechanical Engineering">
                  Mechanical Engineering
                </option>
              </select>
            </div>
          ) : null}

          {/* Email & Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Min. 6 characters"
              />
            </div>
          </div>
          {/* Date of Birth & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Date of Birth
              </label>
              <input
                name="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-dark-border dark:bg-dark-bg dark:text-white focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                gender
              </label>
              <select
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-dark-border dark:bg-dark-bg dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone
            </label>
            <input
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-dark-border dark:bg-dark-bg dark:text-white focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Address */}
          <div className="sm:col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Address
            </label>
            <textarea
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows="3"
              className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-dark-border dark:bg-dark-bg dark:text-white focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
