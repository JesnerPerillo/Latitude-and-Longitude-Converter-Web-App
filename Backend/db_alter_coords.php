<?php 
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "test_coords";

$conn = new mysqli($servername, $username, $password);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql_create_db = "CREATE DATABASE IF NOT EXISTS $dbname";
if ($conn->query($sql_create_db) === TRUE) {
    echo "Database created successfully\n";
} else {
    die("Database creation failed: " . $conn->error);
}

if (!$conn->select_db($dbname)) {
    die("Database selection failed: " . $conn->error);
}

$sql_create_table = "CREATE TABLE IF NOT EXISTS coords_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    notes VARCHAR(255) NOT NULL,
    lat DECIMAL(10, 6) NOT NULL,
    lng DECIMAL(10, 6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (lat),
    INDEX (lng)
)";

if ($conn->query($sql_create_table) === TRUE) {
    echo "Table coords_data created successfully\n";
} else {
    die("Table creation failed: " . $conn->error);
}

function saveCoordinates($notes, $lat, $lng) {
    global $conn;
    
    $stmt = $conn->prepare("INSERT INTO coords_data (notes, lat, lng) VALUES (?, ?, ?)");
    if (!$stmt) {
        die("Prepare failed: " . $conn->error);
    }
    
    $stmt->bind_param("sdd", $notes, $lat, $lng);
    
    if ($stmt->execute()) {
        echo "New coordinates saved successfully\n";
    } else {
        echo "Error: " . $stmt->error;
    }
    $stmt->close();
}

$conn->close();
?>