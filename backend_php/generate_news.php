<?php
// =================================================================
// 📌 generate_news.php
// Generates article and saves it with citations to MySQL database.
// =================================================================

// --- CRITICAL ERROR LOGGING SETUP ---
$baseDir = dirname(__FILE__);
// Force all errors and warnings to be saved to a file instead of printed to the screen
ini_set('log_errors', 'On');
ini_set('error_log', $baseDir . '/php_error.log');
// Ensure NO errors/warnings leak to the client, which fixes the JSON parse error
ini_set('display_errors', 'Off');
error_reporting(E_ALL); 

// 🚨 MANDATORY: Start output buffering at the absolute start to capture all output
ob_start();

// Function to handle JSON response and exit cleanly
function json_response($data, $http_code = 200) {
    // 1. Force clear the buffer of any previous output (warnings, whitespace from includes)
    if (ob_get_level() > 0) {
        ob_clean(); 
    }
    
    // 2. Set headers and output JSON
    header("Content-Type: application/json; charset=UTF-8");
    http_response_code($http_code);
    echo json_encode($data);
    
    // 3. Close the buffer and terminate the script
    if (ob_get_level() > 0) {
        ob_end_flush(); 
    }
    exit;
}

// --- MANDATORY CORS SETUP ---
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
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Handle preflight OPTIONS request (CORS check)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    json_response(["success" => true, "message" => "Preflight successful"], 200);
}


// --- Initialization, Autoload, and Dependencies ---
$autoloadPath = $baseDir . '/vendor/autoload.php';

if (!file_exists($autoloadPath)) {
    json_response(["success" => false, "message" => "FATAL: Composer autoloader not found at: {$autoloadPath}. Run 'composer install'."], 500);
}

// 1. Load the classes from Composer's autoloader FIRST.
require_once $autoloadPath;

// 2. Load the database connection AFTER autoloader is active.
$dbConnectPath = $baseDir . '/db_connect.php'; 
if (!file_exists($dbConnectPath)) {
     json_response(["success" => false, "message" => "FATAL: Database connection file 'db_connect.php' not found at: {$dbConnectPath}."], 500);
}
// Assumes $conn is the mysqli connection object created in db_connect.php
require_once $dbConnectPath; 

// --- USE STATEMENTS ---
// Required for the community SDK's specific constructor needs
use Gemini\Client;
use Gemini\Transporters\HttpTransporter;
use Http\Discovery\Psr18ClientDiscovery; // Finds PSR-18 Client
use Http\Discovery\Psr17FactoryDiscovery; // Finds PSR-7 Factories


// --- Method Check ---
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    json_response(["success" => false, "message" => "Method not allowed. Use POST."], 405);
}

// --- Main Logic ---
try {
    // Input Handling
    $input = json_decode(file_get_contents("php://input"), true);
    $topic = $input['topic'] ?? null;

    if (!$topic) {
        json_response(["success" => false, "message" => "Missing 'topic' in request body."], 400);
    }

    // --- GEMINI API CALL ---
    $apiKey = 'AIzaSyBHXv2b_QNdNX5xPJf5RbywX3_lmQ3CF5U'; 
    $apiBaseUrl = 'https://generativelanguage.googleapis.com/v1beta'; // Standard Gemini API Base URL
    $headers = []; 
    $queryParams = []; // <--- NEW ARGUMENT: Empty array for query parameters

    // 1. Discover required PSR-7/18 components
    $psr18Client = Psr18ClientDiscovery::find();
    $requestFactory = Psr17FactoryDiscovery::findRequestFactory();
    $streamFactory = Psr17FactoryDiscovery::findStreamFactory();

    // 2. Create the Transporter instance with the required 6 arguments
    // CORRECT ORDER: $client, $baseUrl, $headers, $queryParams, $requestFactory, $streamFactory
    $transporter = new HttpTransporter(
        $psr18Client,
        $apiBaseUrl,    // Argument 2 (string)
        $headers,       // Argument 3 (array)
        $queryParams,   // Argument 4 (array) <-- FIX: The missing array
        $requestFactory,  // Argument 5 (object)
        $streamFactory    // Argument 6 (object)
    );

    // 3. Initialize the Client using the Transporter AND the API Key
    $client = new Client($transporter, $apiKey); 
    
    $systemInstruction = "You are a professional, objective tech journalist writing for an e-commerce blog called 'PhoneMart Stories'. Write a detailed, engaging 500-word analysis that uses the live search results to address the topic. Structure the response with clear headings (Markdown H2) and provide a concise conclusion.";
    $prompt = "Write an article based on the following topic: \"{$topic}\"";

    // --- API CALL (Community SDK syntax) ---
    $config = [
        'systemInstruction' => $systemInstruction,
        'tools' => [['googleSearch' => []]] 
    ];

    $result = $client->generateContent(
        'gemini-2.5-flash', // Model name as the first argument
        $prompt,           // Prompt as the second argument
        $config            // Configuration array as the third argument
    );

    $articleText = $result->text;
    $citations = [];
    $groundingMetadata = $result->getGroundingMetadata();
    // Check if groundingMetadata and groundingAttributions exist
    if ($groundingMetadata && $groundingMetadata->getGroundingAttributions()) {
        foreach ($groundingMetadata->getGroundingAttributions() as $attribution) {
            $web = $attribution->getWeb();
            if ($web && $web->getUri()) {
                 $citations[] = ['title' => $web->getTitle() ?? 'No Title Provided', 'uri' => $web->getUri()];
            }
        }
    }
    
    // --- DATABASE INSERTION START ---

    // 1. Prepare and Insert the Article Record
    $sql_article = "INSERT INTO articles (topic, content, date_created) VALUES (?, ?, NOW())";
    
    // Check if $conn is a valid mysqli object before preparing
    if (!isset($conn) || !$conn instanceof mysqli) {
         json_response(["success" => false, "message" => "FATAL: Database connection object (\$conn) is missing or invalid. Check 'db_connect.php'."], 500);
    }
    
    if ($conn->connect_error) {
        // If connection fails here, ensure the error is handled cleanly
        json_response(["success" => false, "message" => "Database connection failed during insertion: " . $conn->connect_error], 500);
    }

    $stmt_article = $conn->prepare($sql_article);
    
    if ($stmt_article === false) {
        throw new Exception("SQL prepare failed for article insertion: " . $conn->error);
    }

    // 's' for string (topic), 's' for string (content)
    $stmt_article->bind_param("ss", $topic, $articleText);
    
    if (!$stmt_article->execute()) {
        throw new Exception("Failed to save article: " . $stmt_article->error);
    }
    
    // 2. Get the new ID for the article (essential for linking citations)
    $article_id = $conn->insert_id; 
    $stmt_article->close();

    // 3. Insert Citations (if any)
    if (!empty($citations)) {
        $sql_citation = "INSERT INTO citations (article_id, uri, title) VALUES (?, ?, ?)";
        $stmt_citation = $conn->prepare($sql_citation);
        
        if ($stmt_citation === false) {
            error_log("SQL prepare failed for citation insertion: " . $conn->error);
            // Continue without citations if preparation fails
        } else {
            // 'iss' for integer (article_id), string (uri), string (title)
            $stmt_citation->bind_param("iss", $article_id, $uri, $title); 
            
            foreach ($citations as $citation) {
                // Ensure data is sanitized/validated before binding if needed, though bind_param helps
                $uri = $citation['uri'];
                $title = $citation['title'] ?? 'No Title Provided';
                
                if (!$stmt_citation->execute()) {
                     error_log("Failed to save citation for article ID {$article_id}: " . $stmt_citation->error);
                     // We continue even if one citation fails
                }
            }
            $stmt_citation->close();
        }
    }
    
    // --- DATABASE INSERTION END ---

    // Final Success Response 
    json_response([
        "success" => true,
        "article" => $articleText,
        "citations" => $citations,
        "message" => "Article generated and saved successfully (ID: {$article_id})."
    ], 200);

} catch (\Exception $e) {
    // Log the error for server-side debugging
    error_log("General Error: " . $e->getMessage());
    // Send a clean, structured JSON error response
    json_response(["success" => false, "message" => "AI Generation or Database failure: " . $e->getMessage()], 500);
}

// Do NOT use a closing PHP tag `?>` to prevent trailing whitespace issues.