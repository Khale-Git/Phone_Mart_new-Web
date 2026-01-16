<?php
session_start();

if (!isset($_SESSION['email'])) {
    echo json_encode(["success" => false, "message" => "User not logged in"]);
    exit();
}

// Get user details from the session
$user_email = $_SESSION['email'];

echo json_encode([
    "success" => true,
    "message" => "User details retrieved",
    "email" => $user_email
]);
?>
