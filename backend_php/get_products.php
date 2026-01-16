<?php
ob_start();

// Display errors (dev)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Start session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Allowed origins
$allowed_origins = [
    'https://phonemart.great-site.net',
    'http://localhost:5173',
    'http://localhost',
    'https://www.phonemart.great-site.net',
    'https://phone-mart-ian-a9e6abhbasaudzb3.southafricanorth-01.azurewebsites.net' 
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}

// Always send these headers
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    ob_end_clean();
    exit;
}

// Database connection
require_once __DIR__ . '/db_connect.php';

$response = ["success" => false, "data" => [], "message" => ""];

try {
    if (!$conn) throw new Exception("Database connection failed");

    $result = $conn->query("SELECT id, name, description, price, image_url FROM products");
    if (!$result) throw new Exception("Query failed: " . $conn->error);

    $products = [];
    while ($row = $result->fetch_assoc()) $products[] = $row;

    $response["success"] = true;
    $response["data"] = $products;
} catch (Exception $e) {
    $response["message"] = $e->getMessage();
    error_log("[get_products.php] " . $e->getMessage());
} finally {
    $conn && $conn->close();
}

ob_end_clean();
echo json_encode($response);
exit;
?>
