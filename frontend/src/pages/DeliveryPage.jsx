import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiTruck, FiCheckCircle, FiX } from 'react-icons/fi';
import DeliveryForm from '../components/delivary manager/DeliveryForm';

const DeliveryPage = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    { name: 'All', icon: <FiPackage className="mr-2" /> },
    { name: 'Processing', icon: <FiPackage className="mr-2" /> },
    { name: 'On the Way', icon: <FiTruck className="mr-2" /> },
    { name: 'Delivered', icon: <FiCheckCircle className="mr-2" /> },
  ];

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await fetch('/api/orders/delivery', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust based on your auth setup
          }
        });
        const data = await response.json();
        if (response.ok) {
          setDeliveries(data);
        } else {
          setError(data.message || 'Failed to fetch deliveries');
        }
      } catch (err) {
        setError('Error fetching deliveries');
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  const handleCancel = async (orderId) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust based on your auth setup
        }
      });
      const data = await response.json();
      if (response.ok) {
        setDeliveries(deliveries.filter(delivery => delivery._id !== orderId));
      } else {
        alert(data.message || 'Failed to cancel order');
      }
    } catch (err) {
      alert('Error cancelling order');
    }
  };

  const getProgress = (status) => {
    switch (status) {
      case 'processing': return 33;
      case 'shipped': return 66; // 'shipped' is mapped to "On the Way"
      case 'delivered': return 100;
      default: return 0;
    }
  };

  const displayStatus = (status) => {
    if (status === 'shipped') return 'On the Way';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const filteredDeliveries = activeTab === 'All'
    ? deliveries
    : deliveries.filter(delivery => 
        (activeTab === 'On the Way' && delivery.status === 'shipped') ||
        (activeTab.toLowerCase() === delivery.status)
      );

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Navigation Bar */}
      <nav className="flex gap-3 p-3 bg-white border-b border-gray-200 mb-6 rounded-lg shadow-sm">
        <Link to="/dashboard" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200">
          Dashboard
        </Link>
        <Link to="/delivery" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200">
          Refund Item
        </Link>
        <Link to="/support" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200">
          Contact Support
        </Link>
      </nav>

      {/* Deliveries Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Deliveries</h2>
            <p className="text-gray-600 text-sm">Track your supermarket orders in real-time</p>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-orange-500 transition-all duration-200 font-medium"
          >
            <FiPackage className="text-lg" />
            <span>New Order</span>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center px-4 py-2 rounded-lg border border-gray-300 transition-all duration-200 ${
                activeTab === tab.name
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              {tab.name}
              <span className="ml-1 text-gray-500">({tab.name === 'All' ? deliveries.length : deliveries.filter(d => (tab.name === 'On the Way' ? d.status === 'shipped' : d.status === tab.name.toLowerCase())).length})</span>
            </button>
          ))}
        </div>

        {/* Delivery List */}
        {loading ? (
          <div className="text-center text-gray-600">Loading deliveries...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : filteredDeliveries.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <FiPackage className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No deliveries found</h3>
            <p className="text-gray-600 mb-4">
              You don't have any deliveries in this category.
            </p>
            <Link
              to="/products"
              className="inline-block bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-orange-500 transition-all duration-200"
            >
              Place a New Order
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDeliveries.map((delivery) => (
              <div key={delivery._id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Order #{delivery._id}</h3>
                    <p className="text-sm text-gray-600">
                      Items: {delivery.items.map(item => `${item.product.name} (x${item.quantity})`).join(', ')}
                    </p>
                    <p className="text-sm text-gray-600">Customer: {delivery.billingInfo.fullName}</p>
                    <p className="text-sm text-gray-600">Shipping Address: {delivery.shippingAddress}</p>
                    <p className="text-sm text-gray-600">Total Price: ${delivery.totalPrice.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Placed on: {new Date(delivery.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      delivery.status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : delivery.status === 'shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {displayStatus(delivery.status)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Order Placed</span>
                    <span>Processing</span>
                    <span>On the Way</span>
                    <span>Delivered</span>
                  </div>
                  <div className="relative w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="absolute h-2 rounded-full"
                      style={{
                        width: `${getProgress(delivery.status)}%`,
                        background: 'linear-gradient(to right, #18A558, #A3EBB1)',
                      }}
                    />
                    <div className="flex justify-between absolute w-full top-[-4px]">
                      {['0', '33', '66', '100'].map((pos, idx) => (
                        <div
                          key={idx}
                          className={`w-4 h-4 rounded-full border-2 ${
                            getProgress(delivery.status) >= parseInt(pos)
                              ? 'bg-green-500 border-green-500'
                              : 'bg-white border-gray-300'
                          }`}
                          style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cancel Button */}
                {delivery.status !== 'delivered' && (
                  <button
                    onClick={() => handleCancel(delivery._id)}
                    className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-all duration-200"
                  >
                    <FiX className="text-lg" />
                    <span>Cancel Order</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Refund Item Section */}
      <section>
        <h2 className="text-2xl font-bold text-green-600 border-b-2 border-green-600 inline-block mb-2">
          REFUND ITEM
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Submit a return or refund request for a delivered order
        </p>
        <DeliveryForm />
      </section>
    </div>
  );
};

export default DeliveryPage;