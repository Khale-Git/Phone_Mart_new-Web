import React, { useEffect, useState } from "react";
import { FaTrash, FaShoppingCart, FaCreditCard, FaMoneyBillWave, FaMobileAlt, FaArrowLeft, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Cart.css";
import api from "../../services/api.jsx";
import { useAuth } from "./../../context/AuthContext.jsx";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- Fetch Cart ---
  const fetchCart = async () => {
    try {
      const response = await api.get("/cart.php");
      const data = response.data;
      if (!data.success) throw new Error(data.message || "Failed to load cart");
      setCartItems(data.cart || []);
      setError("");
    } catch (err) {
      console.error("Cart fetch error:", err);
      setError(err.message);
      setCartItems([]);
    }
  };

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  // --- Remove Item ---
  const removeFromCart = async (productId) => {
    try {
      await api.post("/removecart.php", { product_id: productId });
      setCartItems((prev) => prev.filter((item) => item.product_id !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  // --- Checkout ---
  const handleCheckout = async () => {
    setLoading(true);
    setError("");
    try {
      if (!paymentMethod) throw new Error("Please select a payment method");

      const payload = {
        cartItems: cartItems.map((item) => ({
          product_id: item.product_id,
          product_name: item.product_name,
          price: item.price,
          quantity: item.quantity,
          image_url: item.image_url,
          product_description: item.product_description,
        })),
        paymentMethod,
        userEmail: user.email,
      };

      const response = await api.post("/checkout.php", payload);
      if (!response.data.success) throw new Error(response.data.message || "Checkout failed");

      alert("✅ Order placed successfully!");
      setCartItems([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-wrapper">
      <div className="cart-container">
        
        {/* Header */}
        <div className="cart-header">
          <div className="header-left">
            <h2>Shopping Cart</h2>
            <span className="badge">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <Link to="/dashboard" className="back-link"><FaArrowLeft /> Continue Shopping</Link>
        </div>

        {error && <div className="cart-error">{error}</div>}

        {cartItems.length === 0 ? (
          <div className="empty-cart-state">
            <div className="icon-circle"><FaShoppingCart /></div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/dashboard" className="shop-now-btn">Start Shopping</Link>
          </div>
        ) : (
          <div className="cart-layout">
            
            {/* Left: Cart Items */}
            <div className="cart-items-section">
              {cartItems.map((item) => (
                <div key={item.product_id} className="cart-card">
                  <div className="card-image">
                    <img
                      src={item.image_url || "https://via.placeholder.com/100"}
                      alt={item.product_name}
                      onError={(e) => (e.target.src = "https://via.placeholder.com/100")}
                    />
                  </div>
                  <div className="card-details">
                    <div className="details-header">
                      <h3>{item.product_name}</h3>
                      <div className="price">KSh {Number(item.price).toLocaleString()}</div>
                    </div>
                    
                    <p className="desc">{item.product_description || "High-quality product from Phone Mart."}</p>
                    
                    <div className="details-footer">
                      <div className="qty-badge">Qty: {item.quantity}</div>
                      <button 
                        onClick={() => removeFromCart(item.product_id)} 
                        className="remove-link" 
                        title="Remove Item"
                      >
                        <FaTrash /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Order Summary */}
            <div className="cart-summary-section">
              <div className="summary-card">
                <h3>Order Summary</h3>
                
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>KSh {totalAmount.toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping Estimate</span>
                  <span className="text-muted">Calculated at checkout</span>
                </div>
                <div className="divider"></div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>KSh {totalAmount.toLocaleString()}</span>
                </div>

                {/* Payment Form */}
                <div className="checkout-form">
                  <label className="form-label">Select Payment Method</label>
                  <div className="payment-grid">
                    <label className={`p-option ${paymentMethod === 'M-Pesa' ? 'active' : ''}`}>
                      <input type="radio" name="pay" value="M-Pesa" onChange={(e) => setPaymentMethod(e.target.value)} />
                      <FaMobileAlt className="p-icon" /> 
                      <span>M-Pesa</span>
                    </label>
                    <label className={`p-option ${paymentMethod === 'Credit Card' ? 'active' : ''}`}>
                      <input type="radio" name="pay" value="Credit Card" onChange={(e) => setPaymentMethod(e.target.value)} />
                      <FaCreditCard className="p-icon" /> 
                      <span>Card</span>
                    </label>
                    <label className={`p-option ${paymentMethod === 'PayPal' ? 'active' : ''}`}>
                      <input type="radio" name="pay" value="PayPal" onChange={(e) => setPaymentMethod(e.target.value)} />
                      <FaMoneyBillWave className="p-icon" /> 
                      <span>Cash</span>
                    </label>
                  </div>

                  <label className="form-label">Email Address</label>
                  <div className="input-group">
                    <input type="email" value={user?.email || ''} readOnly className="checkout-input" />
                    <span className="input-icon"><FaLock /></span>
                  </div>

                  <button onClick={handleCheckout} disabled={loading || !paymentMethod} className="checkout-btn">
                    {loading ? "Processing..." : "Complete Purchase"}
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;