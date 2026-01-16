<?php
// ==================================================
// 📌 admin_orders.php
// API for fetching and updating orders (Admin Only)
// ==================================================

session_start();
require_once 'db_connect.php';

// --- CORS HEADERS ---
$allowed_origins = [
    'https://phone-mart-ian-a9e6abhbasaudzb3.southafricanorth-01.azurewebsites.net',
    'http://localhost:5173'
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

header("Content-Type: application/json");

// --- SECURITY CHECK ---
// 1. Check if logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

// 2. Check if Admin (Double verification from DB)
$stmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
$stmt->bind_param("i", $_SESSION['user_id']);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user || $user['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Access Denied: Admins only']);
    exit;
}

// --- HANDLE REQUESTS ---

// 1. UPDATE STATUS (POST)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (isset($input['order_id']) && isset($input['status'])) {
        $updateStmt = $conn->prepare("UPDATE orders SET status = ? WHERE id = ?");
        $updateStmt->bind_param("si", $input['status'], $input['order_id']);
        
        if ($updateStmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Status updated']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Update failed']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Missing data']);
    }
    exit;
}

// 2. FETCH ORDERS (GET)
// We join with order_items if you want details, but for the main table, this is enough
$sql = "SELECT id, product_name, price, user_email, order_date, status, image_url, payment_method FROM orders ORDER BY order_date DESC";
$result = $conn->query($sql);

$orders = [];
while ($row = $result->fetch_assoc()) {
    $orders[] = $row;
}

echo json_encode(['success' => true, 'orders' => $orders]);
?>