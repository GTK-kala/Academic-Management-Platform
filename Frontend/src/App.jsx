import React from "react";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";

const App = () => {
  return (
    <div className="min-h-screen bg-surface dark:bg-dark-bg">
      <Navbar />
      <Sidebar />
    </div>
  );
};

export default App;
