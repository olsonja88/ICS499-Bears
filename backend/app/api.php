<?php
header("Content-Type: application/json");

$response = [
    "message" => "Hello from the PHP API!",
    "status" => "success"
];

echo json_encode($response);
?>
