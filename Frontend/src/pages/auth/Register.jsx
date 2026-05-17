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
    } else if (role === "admin") {
      setStudentRole(false);
      setTeacherRole(false);
    }
  };

  const handleSubmit = async (e) => {
    const BASE_URL = "http://localhost:3001";
    e.preventDefault();
    setError("");

    if (!firstName || !password || !lastName || !email || !phone) {
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
        date_of_birth: dateOfBirth,
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
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8 bg-primary-50 dark:bg-dark-bg">
      <div className="w-full max-w-lg p-8 bg-white shadow-xl dark:bg-dark-card rounded-2xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-primary rounded-xl">
            <span className="text-2xl font-bold text-white">AM</span>
          </div>
          <h2 className="text-3xl font-bold text-primary dark:text-white">
            Create Account
          </h2>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Join the Student Management System
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role selection */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Role
            </label>
            <select
              name="role"
              value={role}
              onChange={(e) => {
                (setRole(e.target.value), HandleRole());
              }}
              className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-dark-border dark:bg-dark-bg dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* First & Last Name */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
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
                className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-lg dark:border-dark-border dark:bg-dark-bg dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="John"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
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
                className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-lg dark:border-dark-border dark:bg-dark-bg dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Doe"
              />
            </div>
          </div>

          {/* Department */}
          {teacherRole ? (
            <div>
              <label
                htmlFor="department"
                className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
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
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-dark-border dark:bg-dark-bg dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="email"
                className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
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
                className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-lg dark:border-dark-border dark:bg-dark-bg dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
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
                className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-lg dark:border-dark-border dark:bg-dark-bg dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Min. 6 characters"
              />
            </div>
          </div>
          {/* Date of Birth & Gender */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            className="flex items-center justify-center w-full py-3 mt-2 font-semibold text-white transition-colors rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg
                className="w-5 h-5 text-white animate-spin"
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

        <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
