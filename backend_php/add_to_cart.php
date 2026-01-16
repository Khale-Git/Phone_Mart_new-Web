<?php
// ==================================================
// 📌 add-to-cart.php
// Handles adding products to user's cart
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
// ✅ Start session
// --------------------------------------------
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// --------------------------------------------
// ✅ Response array
// --------------------------------------------
$response = ["success" => false, "message" => ""];

// --------------------------------------------
// ✅ Check if user is logged in
// --------------------------------------------
if (!isset($_SESSION["email"])) {
    $response["message"] = "User not logged in";
    echo json_encode($response);
    exit;
}

try {
    // --------------------------------------------
    // ✅ Include database connection
    // --------------------------------------------
    require_once 'db_connect.php'; // $conn is available

    if (!$conn) {
        throw new Exception("Database connection failed");
    }

    // --------------------------------------------
    // ✅ Get input
    // --------------------------------------------
    $input = json_decode(file_get_contents("php://input"), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON input");
    }

    if (!isset($input["product_id"]) || !is_numeric($input["product_id"])) {
        throw new Exception("Invalid product ID");
    }

    $email = $_SESSION["email"];
    $productId = (int)$input["product_id"];

    // --------------------------------------------
    // ✅ Check if product exists
    // --------------------------------------------
    $productQuery = $conn->prepare("SELECT * FROM products WHERE id = ?");
    $productQuery->bind_param("i", $productId);
    $productQuery->execute();
    $productResult = $productQuery->get_result();

    if ($productResult->num_rows === 0) {
        throw new Exception("Product not found");
    }

    $product = $productResult->fetch_assoc();

    // --------------------------------------------
    // ✅ Check if item already in cart
    // --------------------------------------------
    $cartQuery = $conn->prepare("SELECT id, quantity FROM cart WHERE user_email = ? AND product_id = ?");
    $cartQuery->bind_param("si", $email, $productId);
    $cartQuery->execute();
    $cartResult = $cartQuery->get_result();

    if ($cartResult->num_rows > 0) {
        $cartItem = $cartResult->fetch_assoc();
        $newQuantity = $cartItem["quantity"] + 1;

        $updateStmt = $conn->prepare("UPDATE cart SET quantity = ? WHERE id = ?");
        $updateStmt->bind_param("ii", $newQuantity, $cartItem["id"]);
        $updateStmt->execute();

        $response["message"] = "Product quantity updated in cart";
    } else {
        $insertStmt = $conn->prepare("
            INSERT INTO cart (user_email, product_id, product_name, 
                              product_description, price, image_url, quantity)
            VALUES (?, ?, ?, ?, ?, ?, 1)
        ");
        $insertStmt->bind_param(
            "sissss",
            $email,
            $productId,
            $product["name"],
            $product["description"],
            $product["price"],
            $product["image_url"]
        );
        $insertStmt->execute();

        $response["message"] = "Product added to cart";
    }

    $response["success"] = true;

} catch (Exception $e) {
    $response["message"] = $e->getMessage();
    error_log("Cart Error: " . $e->getMessage());
} finally {
    // --------------------------------------------
    // ✅ Close prepared statements
    // --------------------------------------------
    isset($productQuery) && $productQuery->close();
    isset($cartQuery) && $cartQuery->close();
    isset($updateStmt) && $updateStmt->close();
    isset($insertStmt) && $insertStmt->close();
    isset($conn) && $conn->close();
}

// --------------------------------------------
// ✅ Output JSON
// --------------------------------------------
ob_end_clean();
echo json_encode($response);
exit;
?>
