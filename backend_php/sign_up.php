<?php
// Set headers for JSON content type
header("Content-Type: application/json");

// ✅ Allow requests from multiple origins
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

// Handle preflight OPTIONS request (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // No Content
    exit;
}

// Include database connection
include 'db_connect.php'; 

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['message' => 'Method not allowed. Use POST.']);
    exit;
}

try {
    // Read JSON input from the request body
    $input = json_decode(file_get_contents('php://input'), true);

    // --- 1. Validation ---
    if (!isset($input['email']) || !filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid or missing email.']);
        exit;
    }
    if (!isset($input['password']) || strlen($input['password']) < 6) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters.']);
        exit;
    }
    if (!isset($input['username']) || empty(trim($input['username']))) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Username is required.']);
        exit;
    }

    $email = $input['email'];
    $raw_password = $input['password'];
    $username = trim($input['username']);
    $password_hash = password_hash($raw_password, PASSWORD_DEFAULT); // Hash password

    // --- 2. Check for Existing Email ---
    $stmtCheck = $conn->prepare("SELECT COUNT(*) FROM users WHERE email = ?");
    $stmtCheck->bind_param("s", $email);
    $stmtCheck->execute();
    $stmtCheck->bind_result($count);
    $stmtCheck->fetch();
    $stmtCheck->close();

    if ($count > 0) {
        http_response_code(409); // Conflict
        echo json_encode(['success' => false, 'message' => 'Email already exists.']);
        exit;
    }

    // --- 3. Insert New User ---
    $stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $email, $password_hash);

    if ($stmt->execute()) {
        http_response_code(201); // Created
        echo json_encode(['success' => true, 'message' => 'User registered successfully.']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: Failed to register user.']);
    }

    $stmt->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
} finally {
    if (isset($conn)) $conn->close();
}

// Best practice: no closing PHP tag
