<?php
// 1. PREVENT BROWSER CONFUSION & ENABLE DEBUGGING
header('Content-Type: text/html; charset=utf-8');
error_reporting(E_ALL);
ini_set('display_errors', 1);
mysqli_report(MYSQLI_REPORT_OFF); // Disable auto-crash to handle errors gracefully

echo "<html><body style='font-family: sans-serif; padding: 20px; background-color: #f4f4f9;'>";
echo "<div style='max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);'>";
echo "<h1 style='border-bottom: 2px solid #333; padding-bottom: 10px;'>🛠️ Database Setup Tool</h1>";

// 2. FETCH CREDENTIALS
// First, try to include the connection file to get variables ($host, $username, etc.)
$db_file = __DIR__ . '/db_connect.php';
if (file_exists($db_file)) {
    require_once $db_file;
}

// 3. CREDENTIAL FALLBACKS (Crucial for Azure)
// If the require_once didn't set these variables globally, we fetch them from ENV
// or fallback to defaults.
if (!isset($host) || empty($host))     $host = getenv('DB_HOST');
if (!isset($username) || empty($username)) $username = getenv('DB_USERNAME');
if (!isset($password) || empty($password)) $password = getenv('DB_PASSWORD');
if (!isset($dbname) || empty($dbname))   $dbname = getenv('DB_DATABASE') ?: 'phonemart';

// Close any connection opened by the include file so we can start fresh
if (isset($conn) && $conn instanceof mysqli) {
    $conn->close();
}

$sql_file = 'schema.sql';

// 4. START SETUP PROCESS
try {
    // A. VALIDATION
    if (empty($host)) {
        throw new Exception("❌ Database Host is missing. Please check your .env settings or db_connect.php");
    }

    echo "<p>🔄 Connecting to MySQL Server: <strong>$host</strong>...</p>";

    // B. CONNECT (Without selecting DB yet)
    $conn = new mysqli($host, $username, $password);

    if ($conn->connect_error) {
        throw new Exception("Connection Failed: " . $conn->connect_error);
    }
    echo "<p style='color:green;'>✅ Connected successfully.</p>";

    // C. RESET DATABASE (Clean Slate)
    // We DROP the DB to avoid 'Table already exists' errors
    $conn->query("DROP DATABASE IF EXISTS $dbname");
    echo "<p>🗑️ Old database '<strong>$dbname</strong>' dropped (if it existed).</p>";

    // D. CREATE DATABASE
    if ($conn->query("CREATE DATABASE $dbname")) {
        echo "<p>✨ Database '<strong>$dbname</strong>' created fresh.</p>";
    } else {
        throw new Exception("Error creating database: " . $conn->error);
    }

    // E. SELECT DATABASE
    $conn->select_db($dbname);

    // F. READ SQL FILE
    if (!file_exists($sql_file)) {
        throw new Exception("SQL File '<strong>$sql_file</strong>' not found in this folder.");
    }
    
    $sql_content = file_get_contents($sql_file);
    if (empty(trim($sql_content))) {
        throw new Exception("SQL File is empty.");
    }

    // G. EXECUTE QUERIES
    echo "<p>🚀 Running SQL commands...</p>";
    
    if ($conn->multi_query($sql_content)) {
        // We must cycle through results to clear the buffer, otherwise PHP hangs
        do {
            if ($result = $conn->store_result()) {
                $result->free();
            }
        } while ($conn->next_result());

        // H. SUCCESS MESSAGE
        echo "<div style='background: #e6fffa; border: 1px solid green; padding: 15px; border-radius: 5px; margin-top: 15px;'>";
        echo "<h2 style='color:green; margin:0;'>🎉 SUCCESS!</h2>";
        echo "<p>Database has been fully reset and imported.</p>";
        echo "</div>";
        
        echo "<p style='color:red; margin-top:20px;'>⚠️ <strong>SECURITY WARNING:</strong> Please delete <code>setup_db.php</code> and <code>schema.sql</code> from your server now.</p>";
        
    } else {
        throw new Exception("SQL Syntax Error: " . $conn->error);
    }

} catch (Exception $e) {
    // I. ERROR HANDLING
    echo "<div style='background: #ffe6e6; border: 1px solid red; padding: 15px; border-radius: 5px; margin-top: 15px;'>";
    echo "<h2 style='color:red; margin:0;'>❌ Setup Failed</h2>";
    echo "<p>" . $e->getMessage() . "</p>";
    echo "</div>";
}

// J. CLEANUP
if (isset($conn) && $conn instanceof mysqli) {
    $conn->close();
}

echo "</div></body></html>";
?>