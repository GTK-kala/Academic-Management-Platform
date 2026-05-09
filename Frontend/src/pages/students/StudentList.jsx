import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button";
import Table from "../../components/common/Table";
import { FiPlus } from "react-icons/fi";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "courses", label: "Courses" },
  { key: "status", label: "Status" },
];

// Dummy data
const students = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    courses: 3,
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    courses: 2,
    status: "Active",
  },
];

const StudentList = () => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary dark:text-white">
          Students
        </h1>
        <Link to="/students/add">
          <Button className="mt-3 sm:mt-0 flex items-center gap-2">
            <FiPlus /> Add Student
          </Button>
        </Link>
      </div>
      <div className="bg-white dark:bg-dark-card rounded-lg shadow p-4">
        <Table columns={columns} data={students} />
      </div>
    </div>
  );
};

export default StudentList;
