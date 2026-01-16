<?php
// Prevent browser extensions from trying to parse this as JSON
header('Content-Type: text/html; charset=utf-8');

// 1. Fetch Credentials from your existing connection file
// This imports $host, $username, $password, $dbname AND creates a $conn
require_once __DIR__ . '/db_connect.php'; 

// We close the default connection from the include because we need to 
// create a special "maintenance connection" without selecting a database first
if (isset($conn)) {
    $conn->close();
}

$sql_file = 'schema.sql';

echo "<html><body style='font-family: sans-serif; padding: 20px;'>";
echo "<h1>🛠️ Database Setup Tool</h1>";

// 2. Connect to MySQL Server (Without selecting a database yet)
// We use the variables imported from db_connect.php
$conn = new mysqli($host, $username, $password);

if ($conn->connect_error) {
    die("<h3 style='color:red'>❌ Connection Failed: " . $conn->connect_error . "</h3></body></html>");
}
echo "<p>✅ Connected to MySQL Server.</p>";

// 3. FORCE RESET: Drop the database if it exists
$conn->query("DROP DATABASE IF EXISTS $dbname");
echo "<p>🗑️ Old database '$dbname' deleted (Clean Slate).</p>";

// 4. Create the Database fresh
if ($conn->query("CREATE DATABASE $dbname")) {
    echo "<p>✨ Database '$dbname' created successfully.</p>";
} else {
    die("<h3 style='color:red'>❌ Error creating DB: " . $conn->error . "</h3></body></html>");
}

// 5. Select the database
$conn->select_db($dbname);

// 6. Read and Run the SQL File
if (!file_exists($sql_file)) {
    die("<h3 style='color:red'>❌ Error: '$sql_file' not found in this folder.</h3></body></html>");
}

$sql_content = file_get_contents($sql_file);

// Run the queries
if ($conn->multi_query($sql_content)) {
    echo "<div style='background: #e6fffa; border: 1px solid green; padding: 15px; border-radius: 5px;'>";
    echo "<h2 style='color:green; margin:0;'>🎉 SUCCESS!</h2>";
    echo "<p>Tables created and data imported.</p>";
    echo "</div>";
    
    // Cycle through results to clear buffer (prevents 'Commands out of sync' errors)
    while ($conn->next_result()) {;} 
} else {
    echo "<h3 style='color:red'>❌ SQL Import Error: " . $conn->error . "</h3>";
}

$conn->close();
echo "</body></html>";
?>