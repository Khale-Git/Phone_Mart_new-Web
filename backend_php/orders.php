<?php
// ==================================================
// 📌 get_orders.php
// Fetch all orders
// ==================================================

ob_start();
header("Content-Type: application/json; charset=UTF-8");

// --------------------------------------------
// ✅ CORS
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

header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    ob_end_clean();
    exit(0);
}

// --------------------------------------------
// ✅ Initialize response
// --------------------------------------------
$response = ["success" => false, "orders" => [], "message" => ""];

// --------------------------------------------
// ✅ Include database connection
// --------------------------------------------
require_once __DIR__ . '/db_connect.php';

try {
    if ($_SERVER["REQUEST_METHOD"] !== "GET") {
        throw new Exception("Method not allowed. Use GET.");
    }

    $sql = "
        SELECT id, product_name, product_description, price, image_url, 
               payment_method, user_email, order_date, status
        FROM orders 
        ORDER BY order_date DESC
    ";

    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Database query failed: " . $conn->error);
    }

    $orders = $result->fetch_all(MYSQLI_ASSOC);
    $response["success"] = true;
    $response["orders"] = $orders;

} catch (Exception $e) {
    $response["message"] = $e->getMessage();
    error_log("get_orders.php Error: " . $e->getMessage());
}

// --------------------------------------------
// ✅ Close connection and output JSON
// --------------------------------------------
if (isset($conn)) $conn->close();
ob_end_clean();
echo json_encode($response);
exit;
?>
