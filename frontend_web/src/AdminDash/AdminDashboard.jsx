import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

// ✅ CORRECT IMPORTS for files in "src/AdminDash/"
// Go up one level (..) to "src", then into "services" or "context"
import api from "../services/api.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth(); 

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // ✅ Use the centralized API service
      const response = await api.get('/admin_orders.php');
      const data = response.data;

      if (data.success) {
        setOrders(data.orders);
      } else {
        console.error("Failed to load:", data.message);
        if (data.message === "Access Denied: Admins only" || data.message === "Not logged in") {
           alert(data.message);
           navigate('/login');
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        alert("Access Denied: Admins only.");
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    // 1. Optimistic Update
    setOrders(prev => prev.map(order => 
      String(order.id) === String(id) ? { ...order, status: newStatus } : order
    ));

    // 2. Send to Backend
    try {
      const response = await api.post('/admin_orders.php', { 
        order_id: id, 
        status: newStatus 
      });
      
      if (!response.data.success) {
        alert("Update failed on server. Reverting...");
        fetchOrders();
      }
    } catch (error) {
      console.error("Update error:", error);
      fetchOrders();
    }
  };

  if (loading) return <div className="loading-screen">Loading PhoneMart Admin...</div>;

  return (
    <div className="admin-container">
      <div className="admin-card">
        
        <div className="admin-header">
          <h1>🛍️ Order Management</h1>
          <span className="order-count">{orders.length} Orders</span>
        </div>
        
        <div className="table-responsive">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Order Date</th>
                <th>Customer</th>
                <th>Price</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="product-col">
                    <img 
                      src={order.image_url} 
                      alt="prod" 
                      className="order-img"
                      onError={(e) => e.target.style.display='none'} 
                    />
                    <div className="product-info">
                      <span className="product-name">{order.product_name}</span>
                      <span className="order-id">ID: #{order.id}</span>
                    </div>
                  </td>

                  <td>{new Date(order.order_date).toLocaleDateString()}</td>
                  <td>{order.user_email}</td>
                  <td className="price-col">KSh {Number(order.price).toLocaleString()}</td>

                  <td>
                    <span className="payment-info">
                       {order.payment_method.includes("M-Pesa") ? "📱" : "💳"} 
                       {order.payment_method}
                    </span>
                  </td>

                  <td>
                    <span className={`status-badge ${order.status ? order.status.toLowerCase() : 'pending'}`}>
                      {order.status || 'Pending'}
                    </span>
                  </td>

                  <td>
                    <select 
                      value={order.status || 'Pending'} 
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;