<?php
// ==================================================
// 📌 get_user.php
// Fetch logged-in user info
// ==================================================

ob_start();
session_start();

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

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// --------------------------------------------
// ✅ Handle preflight OPTIONS request
// --------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    ob_end_clean();
    exit(0);
}

// --------------------------------------------
// ✅ Initialize response array
// --------------------------------------------
$response = ["success" => false, "user" => null, "message" => ""];

// --------------------------------------------
// ✅ Include database connection
// --------------------------------------------
require_once __DIR__ . '/db_connect.php';

try {
    // Check if user session exists
    if (!isset($_SESSION['email'])) {
        throw new Exception("User not logged in");
    }

    $email = $_SESSION['email'];

    // Fetch user info
    $stmt = $conn->prepare("SELECT id, username, email FROM users WHERE email = ?");
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $response["success"] = true;
        $response["user"] = $result->fetch_assoc();
    } else {
        $response["message"] = "User not found";
    }

    $stmt->close();
} catch (Exception $e) {
    $response["message"] = "Server error: " . $e->getMessage();
    error_log("Get User Error: " . $e->getMessage());
}

// Close connection
if (isset($conn)) $conn->close();

// --------------------------------------------
// ✅ Return JSON
// --------------------------------------------
ob_end_clean();
echo json_encode($response);
exit;
?>
