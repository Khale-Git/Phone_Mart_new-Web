<?php
// ==================================================
// 📌 add_user.php
// Handles user registration
// ==================================================

ob_start();
header("Content-Type: application/json");

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

// Handle preflight OPTIONS requests
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    exit(0);
}

// --------------------------------------------
// ✅ Initialize response
// --------------------------------------------
$response = ["success" => false, "message" => ""];

// --------------------------------------------
// ✅ Main logic
// --------------------------------------------
try {
    require_once 'db_connect.php'; // $conn is available

    if (!$conn) {
        throw new Exception("Database connection failed");
    }

    $data = json_decode(file_get_contents("php://input"), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON input");
    }

    $username = trim($data['username'] ?? '');
    $email    = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';

    if (!$username || !$email || !$password) {
        throw new Exception("All fields are required.");
    }

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $conn->prepare("
        INSERT INTO users (username, email, password, created_at, updated_at) 
        VALUES (?, ?, ?, NOW(), NOW())
    ");
    $stmt->bind_param("sss", $username, $email, $hashedPassword);

    if ($stmt->execute()) {
        $response["success"] = true;
        $response["message"] = "User added successfully.";
    } else {
        throw new Exception("Failed to add user: " . $stmt->error);
    }

} catch (Exception $e) {
    $response["message"] = $e->getMessage();
    error_log("Add User Error: " . $e->getMessage());
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
