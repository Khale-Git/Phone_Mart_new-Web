<?php
// 1. START SESSION IMMEDIATELY
session_start(); 

// 2. HEADERS (CORS)
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
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 3. INCLUDE DATABASE
require_once __DIR__ . '/db_connect.php';

try {
    // 4. GET DATA
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['email']) || empty($data['password'])) {
        echo json_encode(['success' => false, 'message' => 'Email and password are required']);
        exit;
    }

    $email = $conn->real_escape_string(trim($data['email']));
    $password = $data['password'];

    // 5. CHECK USER (⚠️ CHANGED: Added 'role' to the SELECT list)
    $result = $conn->query("SELECT id, username, email, password, role FROM users WHERE email = '$email'");

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
        exit;
    }

    $user = $result->fetch_assoc();

    if (!password_verify($password, $user['password'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
        exit;
    }

    // 6. UPDATE LOGIN TIME
    $stmt = $conn->prepare("UPDATE users SET last_logged_in = NOW() WHERE id = ?");
    $stmt->bind_param("i", $user['id']);
    $stmt->execute();

    // 7. SAVE SESSION (⚠️ CHANGED: Added 'role' to session)
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['email'] = $user['email'];
    $_SESSION['role'] = $user['role']; // Critical for Admin checks

    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'role' => $user['role'] // (⚠️ CHANGED: Send role to Frontend)
        ]
    ]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>