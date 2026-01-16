<?php
// ==================================================
// 📌 logout.php
// Destroy user session (log out)
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

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    ob_end_clean();
    exit(0);
}

// --------------------------------------------
// ✅ Initialize response
// --------------------------------------------
$response = ["success" => false, "message" => ""];

// --------------------------------------------
// ✅ Logout logic
// --------------------------------------------
try {
    // Clear all session variables
    $_SESSION = [];

    // Destroy the session cookie if it exists
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }

    // Destroy session
    session_destroy();

    $response["success"] = true;
    $response["message"] = "Logged out successfully";
} catch (Exception $e) {
    $response["message"] = "Logout failed: " . $e->getMessage();
    error_log("Logout Error: " . $e->getMessage());
}

// --------------------------------------------
// ✅ Output JSON
// --------------------------------------------
ob_end_clean();
echo json_encode($response);
exit;
?>
