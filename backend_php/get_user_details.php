<?php
// ==================================================
// 📌 get_single_user.php
// Fetch a single user's details (Admin only)
// ==================================================

ob_start();
session_start();

// --------------------------------------------
// ✅ Headers & CORS
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
header("Content-Type: application/json");

// Handle preflight
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
require_once __DIR__ . '/../db_connect.php';

try {
    // Admin check
    if (!isset($_SESSION['user']) || ($_SESSION['user']['email'] ?? '') !== 'Admin@gmail.com') {
        throw new Exception("Unauthorized");
    }

    // Validate user ID from GET
    $id = $_GET['id'] ?? null;
    if (!$id || !is_numeric($id)) {
        throw new Exception("Valid user ID required");
    }

    // Fetch user details
    $stmt = $conn->prepare("
        SELECT id, username, email, created_at, updated_at, last_logged_in, last_logged_out 
        FROM users 
        WHERE id = ?
    ");
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("i", $id);
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
    $response["message"] = $e->getMessage();
    error_log("Get Single User Error: " . $e->getMessage());
}

// Close DB connection
if (isset($conn)) $conn->close();

// Output JSON
ob_end_clean();
echo json_encode($response);
exit;
?>
