<?php
// ==================================================
// 📌 delete_user.php
// Deletes a user by ID
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

// --------------------------------------------
// ✅ Handle preflight OPTIONS requests
// --------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    ob_end_clean();
    exit(0);
}

// --------------------------------------------
// ✅ Initialize response
// --------------------------------------------
$response = ["success" => false, "message" => ""];

// --------------------------------------------
// ✅ Include database connection
// --------------------------------------------
require_once __DIR__ . '/db_connect.php';

try {
    // ----------------------------------------
    // Verify user session
    // (optional: check admin role)
    // ----------------------------------------
    if (!isset($_SESSION['user_id'])) {
        throw new Exception("Unauthorized: User not logged in");
    }

    // Read input JSON
    $data = json_decode(file_get_contents("php://input"), true);
    $userId = $data['id'] ?? null;

    if (!$userId || !is_numeric($userId)) {
        throw new Exception("User ID is required and must be a number");
    }

    // ----------------------------------------
    // Delete user
    // ----------------------------------------
    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        $response["success"] = true;
        $response["message"] = "User deleted successfully";
    } else {
        $response["message"] = "No user found with that ID";
    }

} catch (Exception $e) {
    $response["message"] = "Error: " . $e->getMessage();
    error_log("Delete User Error: " . $e->getMessage());
}

// --------------------------------------------
// ✅ Close connections
// --------------------------------------------
if (isset($stmt)) $stmt->close();
if (isset($conn)) $conn->close();

// --------------------------------------------
// ✅ Return JSON
// --------------------------------------------
ob_end_clean();
echo json_encode($response);
exit;
?>
