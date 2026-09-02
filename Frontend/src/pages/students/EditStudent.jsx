import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import { FiArrowLeft } from "react-icons/fi";

import Button from "../../components/common/Button";

import { useNavigate, Link, useParams } from "react-router-dom";

import { Fetch_Student, Edit_Student } from "../../services/studentService";

const EditStudent = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("male");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const FetchInitialData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));

      try {
        const studentRes = await Fetch_Student(id, user?.role);

        const studentData = studentRes?.student;

        if (studentData) {
          setFirstName(studentData.first_name || "");
          setLastName(studentData.last_name || "");

          const formattedDate = studentData.date_of_birth
            ? String(studentData.date_of_birth).slice(0, 10)
            : "";

          setDateOfBirth(formattedDate);

          setGender(studentData.gender || "male");
          setPhone(studentData.phone || "");
          setAddress(studentData.address || "");
        } else {
          console.log("No student Data");
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);

        setError("Failed to load required data. Please try again.");
      }
    };

    FetchInitialData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !password ||
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
        first_name: firstName,
        last_name: lastName,
        password,
        date_of_birth: dateOfBirth,
        gender,
        address,
        phone,
      };

      await Edit_Student(id, formData);

      toast.success("Student updated successfully");

      navigate("/students");
    } catch (err) {
      setError(err.message || "Failed to update student.");
    } finally {
      setLoading(false);

      setGender("male");
      setFirstName("");
      setLastName("");
      setDateOfBirth("");
      setPassword("");
      setPhone("");
      setAddress("");
    }
  };

  return (
    <div className="w-full min-w-0">
      <Link
        to="/students"
        className="inline-flex items-center gap-2 mb-6 text-primary dark:text-primary-300"
      >
        <FiArrowLeft />
        Back to Students
      </Link>

      <h1 className="mb-8 text-3xl font-bold text-primary dark:text-white">
        Edit Student
      </h1>

      <div className="w-full max-w-2xl min-w-0 p-6 bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-xl dark:border-dark-border">
        {error && (
          <div className="p-4 mb-6 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full min-w-0 space-y-6">
          <div className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2">
            {/* FIRST NAME */}
            <div className="w-full min-w-0">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                First Name *
              </label>

              <input
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="block w-full min-w-0 px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg box-border dark:border-dark-border dark:bg-dark-bg dark:text-white focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* LAST NAME */}
            <div className="w-full min-w-0">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Name *
              </label>

              <input
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="block w-full min-w-0 px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg box-border dark:border-dark-border dark:bg-dark-bg dark:text-white focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* PASSWORD */}
            <div className="w-full min-w-0">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>

              <input
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full min-w-0 px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg box-border dark:border-dark-border dark:bg-dark-bg dark:text-white focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* DATE OF BIRTH */}
            <div className="w-full min-w-0">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Date of Birth
              </label>

              <input
                name="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
                className="block w-full min-w-0 px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg box-border dark:border-dark-border dark:bg-dark-bg dark:text-white focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* GENDER */}
            <div className="w-full min-w-0">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Gender
              </label>

              <select
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="block w-full min-w-0 px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg box-border dark:border-dark-border dark:bg-dark-bg dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* PHONE */}
            <div className="w-full min-w-0">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone
              </label>

              <input
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="block w-full min-w-0 px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg box-border dark:border-dark-border dark:bg-dark-bg dark:text-white focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* ADDRESS */}
            <div className="w-full min-w-0 sm:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Address
              </label>

              <textarea
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows="3"
                className="block w-full min-w-0 px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg box-border dark:border-dark-border dark:bg-dark-bg dark:text-white focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={() => navigate("/students")}
              variant="secondary"
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "Editing..." : "Edit Student"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudent;
