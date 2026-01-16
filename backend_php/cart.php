<?php
// ==================================================
// 📌 get_cart.php
// Fetches all cart items for logged-in user
// ==================================================

ob_start();

// --------------------------------------------
// ✅ Start session
// --------------------------------------------
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// --------------------------------------------
// ✅ Dynamic CORS
// --------------------------------------------
$allowed_origins = [
    'https://phonemart.great-site.net',
    'http://localhost:5173',
    'http://localhost',
    'https://www.phonemart.great-site.net',
    'https://phone-mart-ian-a9e6abhbasaudzb3.southafricanorth-01.azurewebsites.net' 
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}

header("Content-Type: application/json");

// Handle preflight OPTIONS requests
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    ob_end_clean();
    exit(0);
}

// --------------------------------------------
// ✅ Initialize response
// --------------------------------------------
$response = ["success" => false, "message" => "", "cart" => []];

try {
    // Verify session
    if (!isset($_SESSION["email"])) {
        throw new Exception("User not logged in");
    }

    require_once 'db_connect.php'; // $conn available

    if (!$conn) {
        throw new Exception("Database connection failed");
    }

    $email = $_SESSION["email"];

    // Fetch cart items
    $stmt = $conn->prepare("
        SELECT id, product_id, product_name, product_description, 
               price, image_url, quantity 
        FROM cart 
        WHERE user_email = ?
    ");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    $cartItems = [];
    while ($row = $result->fetch_assoc()) {
        $cartItems[] = $row;
    }

    $response["success"] = true;
    $response["cart"] = $cartItems;

} catch (Exception $e) {
    $response["message"] = $e->getMessage();
    error_log("Get Cart Error: " . $e->getMessage());
} finally {
    isset($stmt) && $stmt->close();
    isset($conn) && $conn->close();
}

// --------------------------------------------
// ✅ Output JSON
// --------------------------------------------
ob_end_clean();
echo json_encode($response);
exit;
?>
