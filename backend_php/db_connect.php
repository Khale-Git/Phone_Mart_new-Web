<?php
// ==================================================
// 📌 db_connect.php
// Loads database credentials from .env and connects
// ==================================================


// Enable error reporting for development (remove in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Set response type to JSON for API usage
header("Content-Type: application/json");

// Load Composer autoload (for phpdotenv)
require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

try {
    // Load .env file
    $dotenv = Dotenv::createImmutable(__DIR__);
    $dotenv->load();

    // Fetch DB credentials from .env with defaults
    $servername = $_ENV['DB_HOST'] ?? 'sql105.infinityfree.com';
    $username   = $_ENV['DB_USER'] ?? 'if0_40313349';
    $password   = $_ENV['DB_PASS'] ?? 'PhoneMart2025';
    $dbname     = $_ENV['DB_NAME'] ?? 'phone_mart';
    $port       = $_ENV['DB_PORT'] ?? 3306;

    // Create MySQLi connection
    $conn = new mysqli($servername, $username, $password, $dbname, $port);

    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }

} catch (Exception $e) {
    // Return JSON error response and exit
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
    exit();
}

// ✅ Connection successful, $conn can now be used in your scripts
// Example usage: $conn->query("SELECT * FROM users");
?>
