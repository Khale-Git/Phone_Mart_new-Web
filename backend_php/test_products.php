<?php
// Enable error reporting
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Allowed origins
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
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

$response = ["success" => false, "products" => [], "message" => ""];

try {
    require_once __DIR__ . '/db_connect.php';

    $sql = "SELECT * FROM products";
    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }

    $products = $result->fetch_all(MYSQLI_ASSOC);

    $response["success"] = true;
    $response["products"] = $products;
    if (empty($products)) {
        $response["message"] = "No products found.";
    }

} catch (Exception $e) {
    $response["message"] = $e->getMessage();
} finally {
    if (isset($conn)) $conn->close();
}

// Send JSON response
echo json_encode($response);
?>
