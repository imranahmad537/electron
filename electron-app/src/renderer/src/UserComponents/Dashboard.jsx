// src/components/Dashboard/MarbleDashboard.jsx

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts";
import {
  DollarSign,
  Cog,
  ClipboardList,
  Warehouse,
  Package,
  Truck,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

// --- MOCK DATA (In a real app, this would come from your API) ---

const kpiData = [
  {
    title: "Monthly Revenue",
    value: "$125,430",
    change: "+12.5%",
    icon: <DollarSign className="h-8 w-8 text-green-500" />,
    changeColor: "text-green-600",
  },
  {
    title: "Production Output (m²)",
    value: "8,210 m²",
    change: "+5.2%",
    icon: <Cog className="h-8 w-8 text-blue-500" />,
    changeColor: "text-green-600",
  },
  {
    title: "Active Orders",
    value: "72",
    change: "-1.8%",
    icon: <ClipboardList className="h-8 w-8 text-orange-500" />,
    changeColor: "text-red-600",
  },
  {
    title: "Inventory Stock",
    value: "45 Types",
    change: "3,500 Blocks",
    icon: <Warehouse className="h-8 w-8 text-purple-500" />,
    changeColor: "text-gray-500",
  },
];

const salesData = [
  { name: "Week 1", revenue: 28000 },
  { name: "Week 2", revenue: 35000 },
  { name: "Week 3", revenue: 29000 },
  { name: "Week 4", revenue: 41000 },
];

const productionData = [
    { name: "Carrara", "production (m²)": 420 },
    { name: "Calacatta", "production (m²)": 350 },
    { name: "Statuario", "production (m²)": 280 },
    { name: "Emperador", "production (m²)": 210 },
    { name: "Crema Marfil", "production (m²)": 150 },
];

const orderStatusData = [
  { name: "Completed", value: 45 },
  { name: "Processing", value: 15 },
  { name: "Shipped", value: 8 },
  { name: "Pending", value: 4 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const recentOrders = [
  { id: "ORD-00754", customer: "Modern Designs Inc.", type: "Calacatta Gold", amount: "$12,500", status: "Shipped" },
  { id: "ORD-00753", customer: "Prestige Homes", type: "Statuario", amount: "$8,200", status: "Processing" },
  { id: "ORD-00752", customer: "City Builders", type: "Carrara White", amount: "$21,000", status: "Completed" },
  { id: "ORD-00751", customer: "Luxury Interiors", type: "Emperador Dark", amount: "$5,600", status: "Completed" },
  { id: "ORD-00750", customer: "John's Constructions", type: "Crema Marfil", amount: "$3,100", status: "Pending" },
];


const Dashboard = () => {

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="text-green-500" />;
      case "Processing":
        return <Cog className="text-blue-500 animate-spin" style={{ animationDuration: '3s' }} />;
      case "Shipped":
        return <Truck className="text-orange-500" />;
      case "Pending":
        return <AlertCircle className="text-yellow-500" />;
      default:
        return <Package />;
    }
  };
  
  const getStatusChipClass = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-orange-100 text-orange-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        {/* You can add a date picker or other controls here */}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-gray-50 p-6 rounded-2xl shadow-sm flex items-center gap-6 transition hover:bg-gray-100 hover:shadow-md">
            {kpi.icon}
            <div>
              <p className="text-sm text-gray-500">{kpi.title}</p>
              <p className="text-2xl font-bold text-gray-800">{kpi.value}</p>
              <p className={`text-xs font-semibold ${kpi.changeColor}`}>{kpi.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Sales Revenue Chart (Larger) */}
        <div className="lg:col-span-3 bg-gray-50 p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Sales Revenue - Last 4 Weeks</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd' }}/>
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Chart (Smaller) */}
        <div className="lg:col-span-2 bg-gray-50 p-6 rounded-2xl shadow-sm flex flex-col items-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 self-start">Order Status</h2>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {orderStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>

      </div>

      {/* Production & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Production Chart */}
         <div className="bg-gray-50 p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Production by Marble Type</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productionData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" stroke="#6b7280" />
                    <YAxis dataKey="name" type="category" width={100} stroke="#6b7280" />
                    <Tooltip cursor={{fill: 'rgba(243, 244, 246, 0.5)'}} contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd' }} />
                    <Bar dataKey="production (m²)" fill="#8884d8" barSize={20} />
                </BarChart>
            </ResponsiveContainer>
         </div>

        {/* Recent Orders Table */}
        <div className="bg-gray-50 p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            <th scope="col" className="px-4 py-3">Order ID</th>
                            <th scope="col" className="px-4 py-3">Customer</th>
                            <th scope="col" className="px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrders.map((order) => (
                            <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-900">{order.id}</td>
                                <td className="px-4 py-3">{order.customer}</td>
                                <td className="px-4 py-3">
                                  <span className={`inline-flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-full ${getStatusChipClass(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    {order.status}
                                  </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;