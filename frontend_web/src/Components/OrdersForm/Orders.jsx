import React, { useState, useEffect } from "react";
import { 
  FaBoxOpen, FaCalendarAlt, FaMoneyBillWave, FaUser, 
  FaCreditCard, FaMobileAlt, FaShoppingBag, FaEye 
} from "react-icons/fa";
import "./Orders.css";

// ✅ CORRECT IMPORTS for this folder depth
// Go up 2 levels (../../) to reach 'src'
import api from "../../services/api"; 
import { useAuth } from "../../context/AuthContext"; 

const Orders = () => {
  const [filteredOrders, setFilteredOrders] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // ✅ Use the centralized API service
        // This automatically adds the Base URL and Credentials
        const response = await api.get('/orders.php');
        const data = response.data; // Axios/api wrapper returns data here

        if (data.success) {
          const allOrders = data.orders;
          
          // ✅ Robust Admin Check
          const isAdmin = (user.role === 'admin') || (user.email && user.email.toLowerCase() === "admin@gmail.com");

          if (isAdmin) {
            setFilteredOrders(allOrders);
          } else {
            // Filter for regular users (Safety check)
            const userOrders = allOrders.filter(
              (order) => order.user_email.toLowerCase() === user.email.toLowerCase()
            );
            setFilteredOrders(userOrders);
          }
        } else {
          // Handle "No orders" gracefully
          if (data.message === "No orders found") {
             setFilteredOrders([]);
          } else {
             throw new Error(data.message || "Failed to fetch orders");
          }
        }
      } catch (err) {
        console.error("Order fetch error:", err);
        // Don't show error if it's just empty
        if (err.response && err.response.status === 404) {
           setFilteredOrders([]);
        } else {
           setError("Could not load orders.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Helper for Payment Icons
  const getPaymentIcon = (method) => {
    const m = method ? method.toLowerCase() : "";
    if (m.includes("m-pesa")) return <FaMobileAlt className="pay-icon mpesa" />;
    if (m.includes("card") || m.includes("credit")) return <FaCreditCard className="pay-icon card" />;
    return <FaMoneyBillWave className="pay-icon cash" />;
  };

  // ✅ Helper for Status Color (Consistent with Admin Dash)
  const getStatusClass = (status) => {
      if (!status) return "pending"; 
      return status.toLowerCase();
  };

  const isAdmin = user && ((user.role === 'admin') || (user.email.toLowerCase() === "admin@gmail.com"));

  return (
    <div className="orders-wrapper">
      <div className="orders-container">
        
        <div className="orders-header">
          <h2>
            <FaShoppingBag className="header-icon" />
            {isAdmin ? "All User Orders" : "My Order History"}
          </h2>
          <span className="order-count-badge">{filteredOrders.length} Orders</span>
        </div>

        {loading && <div className="orders-loading">Loading your orders...</div>}
        {error && <div className="orders-error">{error}</div>}

        {!loading && filteredOrders.length === 0 && !error ? (
          <div className="empty-orders">
            <div className="empty-icon-circle"><FaBoxOpen /></div>
            <h3>No orders found</h3>
            <p>It looks like you haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Product</th>
                  <th>Date</th>
                  <th>Price</th>
                  <th>Payment</th>
                  {isAdmin && <th>Customer</th>}
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="id-col">#{order.id}</td>
                    <td className="product-col">
                      <div className="product-info-cell">
                        <img
                          src={order.image_url}
                          alt={order.product_name}
                          className="table-thumb"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                        <div className="product-text">
                          <span className="p-name">{order.product_name}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="date-col">
                      <div className="date-wrapper">
                        <FaCalendarAlt className="date-icon" />
                        {new Date(order.order_date).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="price-col">
                      KSh {Number(order.price).toLocaleString()}
                    </td>

                    <td>
                      <div className="payment-pill">
                        {getPaymentIcon(order.payment_method)}
                        {order.payment_method}
                      </div>
                    </td>

                    {isAdmin && (
                      <td className="user-col">
                        <small>{order.user_email}</small>
                      </td>
                    )}

                    <td>
                      <span className={`status-badge ${getStatusClass(order.status)}`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>

                    <td className="text-center">
                      <button className="view-btn">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;