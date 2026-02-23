const SuperAdminDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-secondary dark:text-primary mb-6">
        Super Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Users" value="1,234" />
        <StatCard title="Active Sessions" value="56" />
        <StatCard title="System Health" value="98%" />
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
    <h3 className="text-lg font-medium text-secondary dark:text-primary">
      {title}
    </h3>
    <p className="text-3xl font-bold text-secondary dark:text-primary mt-2">
      {value}
    </p>
  </div>
);

export default SuperAdminDashboard;
