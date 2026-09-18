// src/layouts/AppLayout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header"; // Ensure this exists!

const AppLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar stays fixed on the left */}
      <Sidebar />

      {/* Main content area takes up remaining space */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header stays fixed at the top */}
        <Header />

        {/* Page content scrolls independently */}
        <main className="flex-1 overflow-y-auto p-6 fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
