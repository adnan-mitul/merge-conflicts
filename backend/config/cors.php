<?php

return [

    'paths' => ['api/*'], // no need for sanctum/csrf-cookie for Bearer tokens
    'allowed_methods' => ['*'],

    // Put your React dev origins here:
    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
    ],

    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],

    // You will read the token from the Authorization header on the client.
    'exposed_headers' => ['Authorization'],

    // CRITICAL: set to false since we aren't using cookies/sessions for API
    'supports_credentials' => false,

    'max_age' => 0,
];
