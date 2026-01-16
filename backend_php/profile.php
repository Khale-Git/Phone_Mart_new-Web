<?php
// ==================================================
// 📌 profile.php
// Fetch logged-in user profile
// ==================================================

// Disable warnings/errors in output
error_reporting(0);
ini_set('display_errors', 0);

session_start();

// --------------------------------------------
// ✅ CORS Headers for dev and production
// --------------------------------------------
$allowed_origins = [
    'http://localhost:5173',
    'https://phonemart.great-site.net',
    'https://www.phonemart.great-site.net',
    'http://phonemart.great-site.net',
    // // include www variant if used
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    http_response_code(200);
    exit(0);
}

// --------------------------------------------
// ✅ Initialize response
// --------------------------------------------
$response = ["success" => false, "user" => null, "message" => ""];

// --------------------------------------------
// ✅ Check if user is logged in
// --------------------------------------------
if (!isset($_SESSION["email"])) {
    $response["message"] = "User not logged in";
    echo json_encode($response);
    exit;
}

try {
    require_once 'db_connect.php';

    if (!$conn) {
        throw new Exception("Database connection failed.");
    }

    $email = $_SESSION["email"];

    // Fetch user
    $stmt = $conn->prepare("SELECT id, username, email FROM users WHERE email = ?");
    if (!$stmt) throw new Exception($conn->error);

    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $response["success"] = true;
        $response["user"] = $user;
    } else {
        $response["message"] = "User not found";
    }
} catch (Exception $e) {
    error_log("profile.php Error: " . $e->getMessage());
    $response["message"] = "An error occurred while fetching the profile.";
} finally {
    if (isset($stmt)) $stmt->close();
    if (isset($conn)) $conn->close();
}

// Output JSON
echo json_encode($response);
exit;
?>
