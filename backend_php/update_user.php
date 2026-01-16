<?php
// Enable error reporting for debugging
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

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$response = ['success' => false, 'message' => ''];

try {
    // Include database connection
    require_once __DIR__ . '/db_connect.php';

    // Parse incoming JSON
    $data = json_decode(file_get_contents("php://input"), true);

    $id = isset($data['id']) ? intval($data['id']) : 0;
    $username = isset($data['username']) ? trim($data['username']) : '';
    $email = isset($data['email']) ? trim($data['email']) : '';
    $password = $data['password'] ?? '';

    if (!$id || !$username || !$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Missing or invalid required fields.');
    }

    // Prepare SQL depending on whether password is provided
    if (!empty($password)) {
        if (strlen($password) < 6) {
            throw new Exception('Password must be at least 6 characters.');
        }
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $conn->prepare("UPDATE users SET username = ?, email = ?, password = ?, updated_at = NOW() WHERE id = ?");
        $stmt->bind_param("sssi", $username, $email, $hashedPassword, $id);
    } else {
        $stmt = $conn->prepare("UPDATE users SET username = ?, email = ?, updated_at = NOW() WHERE id = ?");
        $stmt->bind_param("ssi", $username, $email, $id);
    }

    if (!$stmt->execute()) {
        throw new Exception('Failed to update user: ' . $stmt->error);
    }

    $response['success'] = true;
    $response['message'] = 'User updated successfully.';

    $stmt->close();

} catch (Exception $e) {
    $response['message'] = $e->getMessage();
} finally {
    if (isset($conn)) $conn->close();
}

echo json_encode($response);
?>
