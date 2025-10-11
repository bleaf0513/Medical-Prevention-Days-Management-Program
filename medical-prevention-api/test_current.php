<?php

// Test the updated registration endpoint
$url = 'http://127.0.0.1:8000/api/register';

// Test with new email
$data = [
    'first_name' => 'Test',
    'last_name' => 'User',
    'email' => 'testuser' . time() . '@example.com',
    'phone' => '123456789',
    'pin' => '12345678'
];

$options = [
    'http' => [
        'header' => "Content-Type: application/json\r\nAccept: application/json\r\n",
        'method' => 'POST',
        'content' => json_encode($data),
        'ignore_errors' => true
    ]
];

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);

echo "Response: " . $result . "\n";

if (isset($http_response_header)) {
    echo "Status: " . $http_response_header[0] . "\n";
}

