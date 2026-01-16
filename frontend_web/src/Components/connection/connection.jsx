/**
 * 🌐 Centralized API Configuration for PhoneMart
 * ------------------------------------------------
 * Change BASE_URL to switch between live server and local development.
 */

// 🌍 LIVE AZURE SERVER (Active)
// This points to your new PHP Backend on Azure
export const BASE_URL = "https://phone-mart-ian-a9e6abhbasaudzb3.southafricanorth-01.azurewebsites.net/";

// 🏠 LOCAL DEVELOPMENT (Commented out)
// export const BASE_URL = "http://localhost/phone_mart/"; 

/**
 * ✅ Centralized API Endpoints
 * All backend PHP endpoints are listed here.
 */
export const API = {
  ADD_TO_CART: `${BASE_URL}add_to_cart.php`,
  ADD_USER: `${BASE_URL}add_user.php`,
  CART: `${BASE_URL}cart.php`,
  CHECK_SESSION: `${BASE_URL}check_session.php`,
  CHECKOUT: `${BASE_URL}checkout.php`,
  DELETE_USER: `${BASE_URL}delete_user.php`,
  GET_PRODUCTS: `${BASE_URL}get_products.php`,
  GET_SESSION: `${BASE_URL}get_session.php`,
  GET_USER_DETAILS: `${BASE_URL}get_user_details.php`,
  LOGIN: `${BASE_URL}login.php`,
  LOGOUT: `${BASE_URL}logout.php`,
  ORDERS: `${BASE_URL}orders.php`,
  PROFILE: `${BASE_URL}profile.php`,
  REMOVE_CART: `${BASE_URL}removecart.php`,
  SIGN_UP: `${BASE_URL}sign_up.php`,
  UPDATE_USER: `${BASE_URL}update_user.php`,
  USER: `${BASE_URL}user.php`,
  USERS: `${BASE_URL}users.php`,
  TEST_DB: `${BASE_URL}test_db.php`,
  TEST_PRODUCTS: `${BASE_URL}test_products.php`,
  TEST: `${BASE_URL}test.php`,
  ADMIN_ORDERS: `${BASE_URL}admin_orders.php`,

};

/**
 * 🧠 Helper function to make API calls easily.
 * Handles JSON parsing and error detection.
 */
export const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(endpoint, {
      credentials: "include", // ensures PHP session cookies are sent
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Read response as text to handle potential PHP warnings/whitespace
    const text = await response.text();
    const trimmedText = text.trim(); 

    // Try to parse JSON directly first
    try {
      return JSON.parse(trimmedText);
    } catch {
      // Fallback: extract valid JSON from mixed output
      const match = trimmedText.match(/\{[\s\S]*\}/);
      if (match) {
        try {
            return JSON.parse(match[0]);
        } catch (e) {
             console.error("Failed to parse extracted JSON:", match[0], e);
             throw new Error("Invalid JSON response structure extracted from server.");
        }
      }
      throw new Error("Invalid JSON response from server");
    }
  } catch (error) {
    console.error("❌ API Fetch Error:", error.message);
    throw new Error(error.message || "Network error occurred");
  }
};