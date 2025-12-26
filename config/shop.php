<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Pagination Configuration
    |--------------------------------------------------------------------------
    */
    'pagination' => [
        'per_page' => env('SHOP_PRODUCTS_PER_PAGE', 12),
    ],

    /*
    |--------------------------------------------------------------------------
    | Stock Configuration
    |--------------------------------------------------------------------------
    */
    'stock' => [
        'low_stock_threshold' => env('SHOP_LOW_STOCK_THRESHOLD', 5),
    ],

    /*
    |--------------------------------------------------------------------------
    | Admin Configuration
    |--------------------------------------------------------------------------
    */
    'admin' => [
        'email' => env('SHOP_ADMIN_EMAIL', 'admin@trustfactory.test'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Reports Configuration
    |--------------------------------------------------------------------------
    */
    'reports' => [
        'daily_sales' => [
            'enabled' => env('SHOP_DAILY_REPORT_ENABLED', true),
            'time' => env('SHOP_DAILY_REPORT_TIME', '17:15'),
            'max_cached' => env('SHOP_DAILY_REPORT_MAX_CACHED', 7),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Notifications Configuration
    |--------------------------------------------------------------------------
    */
    'notifications' => [
        'low_stock' => [
            'enabled' => env('SHOP_LOW_STOCK_NOTIFICATION', true),
            'max_cached' => env('SHOP_LOW_STOCK_MAX_CACHED', 10),
        ],
    ],
];
