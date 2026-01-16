import React, { useState, useEffect, useMemo } from "react";
import "./Dashboard.css";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);
  const { user } = useAuth();

  // --- Fetch Logic ---
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/get_products.php");
      if (response.data.success) {
        setProducts(response.data.data || []);
      }
    } catch (err) {
      console.error(err);
      setProducts([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  // --- Add to Cart Logic ---
  const handleAddToCart = async (productId) => {
    if (!user) return alert("Login required");
    setAddingToCart(productId);
    try {
      await api.post("/add_to_cart.php", { product_id: productId });
      alert("Added to cart");
    } catch (err) {
      console.error(err);
    } finally {
      setAddingToCart(null);
    }
  };

  // --- Filter Logic ---
  const filteredProducts = useMemo(() => 
    products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())), 
    [products, searchQuery]
  );

  return (
    <div className="dashboard-card-container">
      <h1 className="dashboard-title">Phone Mart Dashboard</h1>

      {/* Dark Search Bar */}
      <div className="search-wrapper">
        <input
          type="text"
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a phone"
        />
      </div>

      {/* States */}
      {loading && <p className="status-msg">Loading products...</p>}
      {!loading && filteredProducts.length === 0 && <p className="status-msg">No products found.</p>}

      {/* Product Grid */}
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-item">
            <img
              src={product.image_url || "https://via.placeholder.com/300"}
              alt={product.name}
              className="product-image"
              onError={(e) => e.target.src = "https://via.placeholder.com/300?text=No+Image"}
            />
            <h2>{product.name}</h2>
            <p className="product-desc">{product.description || "Latest model"}</p>
            <p className="product-price">Price: Ksh {Number(product.price).toLocaleString()}</p>
            
            <button
              onClick={() => handleAddToCart(product.id)}
              disabled={addingToCart === product.id}
              className="add-btn"
            >
              {addingToCart === product.id ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;