import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../components/common/Button";

const AddStudent = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("male");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
    e.preventDefault();
    setError("");

    // Validate
    if (
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !gender ||
      !address ||
      !phone
    ) {
      setError(
        "Date of birth, password, first name, last name, gender, address, and phone are required.",
      );
      return;
    }

    setLoading(true);
    try {
      const formData = {
        firstName,
        lastName,
        dateOfBirth,
        gender,
        address,
        phone,
      };
      const res = await fetch(`${BASE_URL}/students/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData);
        toast.error(errorData.message || "Failed to add student");
      } else {
        const data = await res.json();
        console.log(formData);
        toast.success(data.message || "Student added successfully");
      }
    } catch (err) {
      setError(err.message || "Failed to create student.");
    } finally {
      setLoading(false);
      setGender("male");
      setFirstName("");
      setLastName("");
      setDateOfBirth("");
      setPhone("");
      setAddress("");
    }
  };

  return (
    <div>
      <Link
        to="/students"
        className="inline-flex items-center gap-2 mb-6 text-primary dark:text-primary-300"
      >
        <FiArrowLeft /> Back to Students
      </Link>

      <h1 className="mb-8 text-3xl font-bold text-primary dark:text-white">
        Add New Student
      </h1>

      <div className="max-w-2xl p-6 bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-xl dark:border-dark-border">
        {error && (
          <div className="p-4 mb-6 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                First Name *
              </label>
              <input
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-dark-border dark:bg-dark-bg dark:text-white focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Name *
              </label>
              <input
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-dark-border dark:bg-dark-bg dark:text-white focus:ring-2 focus:ring-primary"
              />
            </div>
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
          </div>

          <div className="flex justify-end gap-4">
            <Button onClick={() => navigate("/students")} variant="secondary">
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Add Student"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
