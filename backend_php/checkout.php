<?php
// ==================================================
// 📌 checkout.php
// Processes orders from cart items
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
// ✅ Require database connection
// --------------------------------------------
require_once __DIR__ . '/db_connect.php';

try {
    // ----------------------------------------
    // Verify user is logged in via session
    // ----------------------------------------
    if (!isset($_SESSION['email'])) {
        throw new Exception("User not logged in");
    }

    $userEmail = $_SESSION['email'];

    // ----------------------------------------
    // Parse input JSON
    // ----------------------------------------
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (
        !$data ||
        !isset($data['cartItems']) || !is_array($data['cartItems']) ||
        !isset($data['paymentMethod'])
    ) {
        throw new Exception("Invalid input data");
    }

    $cartItems = $data['cartItems'];
    $paymentMethod = $data['paymentMethod'];

    if (empty($cartItems)) {
        throw new Exception("Cart is empty");
    }

    // ----------------------------------------
    // Start transaction
    // ----------------------------------------
    $conn->begin_transaction();

    $stmt = $conn->prepare("
        INSERT INTO orders 
        (product_name, product_description, price, image_url, payment_method, user_email, quantity)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");

    foreach ($cartItems as $item) {
        $productName = $item['product_name'] ?? '';
        $productDescription = $item['product_description'] ?? '';
        $price = $item['price'] ?? 0;
        $imageUrl = $item['image_url'] ?? '';
        $quantity = $item['quantity'] ?? 1;

        $stmt->bind_param(
            "ssdsssi",
            $productName,
            $productDescription,
            $price,
            $imageUrl,
            $paymentMethod,
            $userEmail,
            $quantity
        );

        $stmt->execute();
    }

    $conn->commit();

    $response["success"] = true;
    $response["message"] = "Order placed successfully";

} catch (Exception $e) {
    if ($conn->in_transaction) {
        $conn->rollback();
    }
    $response["message"] = "Server error: " . $e->getMessage();
    error_log("Checkout Error: " . $e->getMessage());
}

// --------------------------------------------
// ✅ Close statement and connection
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
