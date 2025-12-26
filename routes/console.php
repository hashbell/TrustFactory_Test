<?php

use App\Jobs\DailySalesReportJob;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

// Daily Sales Report - runs at configured time
Schedule::job(new DailySalesReportJob)
    ->dailyAt(config('shop.reports.daily_sales.time', '18:00'))
    ->when(fn () => config('shop.reports.daily_sales.enabled', true));

// Manual command to trigger the report
Artisan::command('report:daily-sales', function () {
    DailySalesReportJob::dispatch();
    $this->info('Daily sales report dispatched.');
})->purpose('Send the daily sales report');
