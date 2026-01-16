<?php
// Start output buffering
ob_start();

session_start();
header("Content-Type: application/json");

// ✅ CORS: allow both dev and production
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

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    http_response_code(200);
    exit(0);
}

$response = ['success' => false, 'message' => ''];

try {
    // Verify session
    if (!isset($_SESSION['email'])) {
        throw new Exception('User not logged in');
    }

    // Include database connection
    require_once 'db_connect.php';
    
    if (!$conn) {
        throw new Exception('Database connection failed');
    }

    // Get input data
    $input = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON input');
    }

    if (!isset($input['product_id']) || !is_numeric($input['product_id'])) {
        throw new Exception('Invalid product ID');
    }

    $email = $_SESSION['email'];
    $productId = (int)$input['product_id'];

    // Delete item from cart
    $stmt = $conn->prepare("
        DELETE FROM cart 
        WHERE user_email = ? AND product_id = ?
    ");
    $stmt->bind_param("si", $email, $productId);
    $stmt->execute();
    
    if ($stmt->affected_rows > 0) {
        $response = [
            'success' => true,
            'message' => 'Item removed from cart'
        ];
    } else {
        $response['message'] = 'Item not found in cart';
    }
    
} catch (Exception $e) {
    $response['message'] = 'Error removing item: ' . $e->getMessage();
    error_log($response['message']);
}

// Clean output and send response
ob_end_clean();
echo json_encode($response);
exit;
?>
