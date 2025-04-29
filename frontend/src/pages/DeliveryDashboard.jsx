import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import Header from "../components/home/Header";
import { FiPackage, FiTruck, FiMap, FiCalendar, FiUsers, FiClipboard } from "react-icons/fi";

const DeliveryDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [deliveryStats, setDeliveryStats] = useState({
    pendingDeliveries: 0,
    inTransit: 0,
    completed: 0,
    totalDrivers: 0,
  });

  // Only allow storekeeper@example.com to access this page
  if (!user || user.email !== "storekeeper@example.com") {
    return <Navigate to="/" />;
  }

  const deliveryFeatures = [
    {
      title: "Manage Deliveries",
      icon: <FiPackage className="text-3xl" />,
      description: "View and manage all deliveries",
      path: "/manage-deliveries",
      color: "bg-blue-500",
    },
    {
      title: "Track Deliveries",
      icon: <FiMap className="text-3xl" />,
      description: "Real-time delivery tracking",
      path: "/track-deliveries",
      color: "bg-green-500",
    },
    {
      title: "Delivery Schedule",
      icon: <FiCalendar className="text-3xl" />,
      description: "Plan and schedule deliveries",
      path: "/delivery-schedule",
      color: "bg-yellow-500",
    },
    {
      title: "Manage Drivers",
      icon: <FiUsers className="text-3xl" />,
      description: "Driver management and assignments",
      path: "/manage-drivers",
      color: "bg-purple-500",
    },
    {
      title: "Delivery Reports",
      icon: <FiClipboard className="text-3xl" />,
      description: "View delivery analytics and reports",
      path: "/delivery-reports",
      color: "bg-red-500",
    },
    {
      title: "Vehicle Management",
      icon: <FiTruck className="text-3xl" />,
      description: "Manage delivery vehicles",
      path: "/vehicle-management",
      color: "bg-indigo-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header searchTerm="" setSearchTerm={() => {}} cartCount={0} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Delivery Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage and track all delivery operations</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FiPackage size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Pending Deliveries</p>
                <p className="text-2xl font-semibold text-gray-900">{deliveryStats.pendingDeliveries}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <FiTruck size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">In Transit</p>
                <p className="text-2xl font-semibold text-gray-900">{deliveryStats.inTransit}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FiPackage size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Completed Today</p>
                <p className="text-2xl font-semibold text-gray-900">{deliveryStats.completed}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FiUsers size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Active Drivers</p>
                <p className="text-2xl font-semibold text-gray-900">{deliveryStats.totalDrivers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deliveryFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className={`inline-flex p-3 rounded-full ${feature.color} bg-opacity-10 mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <button
                  onClick={() => navigate(feature.path)}
                  className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors duration-300"
                >
                  Access
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard; 