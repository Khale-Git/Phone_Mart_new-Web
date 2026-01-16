<?php
// ==================================================
// 📌 check_session.php
// Checks if a user session exists
// ==================================================

ob_start();

// --------------------------------------------
// ✅ Start session if not started
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
    header("Access-Control-Allow-Methods: GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    ob_end_clean();
    exit(0);
}

// --------------------------------------------
// ✅ Initialize response
// --------------------------------------------
$response = ["success" => false, "message" => ""];

// --------------------------------------------
// ✅ Check session
// --------------------------------------------
try {
    if (isset($_SESSION['user_id'])) {
        $response = [
            "success" => true,
            "message" => "User is logged in",
            "user_id" => $_SESSION['user_id'],
            "username" => $_SESSION['username'] ?? null,
            "email" => $_SESSION['email'] ?? null
        ];
    } else {
        $response["message"] = "User is not logged in";
    }
} catch (Exception $e) {
    $response["message"] = "Error checking session: " . $e->getMessage();
    error_log("Session Check Error: " . $e->getMessage());
}

// --------------------------------------------
// ✅ Output JSON only
// --------------------------------------------
ob_end_clean();
echo json_encode($response);
exit;
?>
