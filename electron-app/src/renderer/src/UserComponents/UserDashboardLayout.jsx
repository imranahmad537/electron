import Sidebar from "./UserSidebar";
import Navbar from "../Navbar";
// import DashboardCard from "./DashboardCard";
// import { Users, BarChart2, Folder, Shield, Plus } from "lucide-react";
import { Outlet } from "react-router-dom";

const UserDashboardLayout = () => {  
  return (
    <div className="min-h-screen bg-blue-50 p-4 flex gap-2">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="bg-white rounded-3xl p-4 shadow-inner flex-1">
          <Outlet/>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
