<?php

namespace App\Jobs;

use App\DTOs\SalesReportData;
use App\Mail\DailySalesReport;
use App\Models\Order;
use App\Services\SalesReportService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class DailySalesReportJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public function handle(SalesReportService $salesReportService): void
    {
        $adminEmail = config('shop.admin.email');

        Log::info('[DAILY REPORT] Job started for '.today()->format('Y-m-d'));
        Log::info("[DAILY REPORT] Recipient: {$adminEmail}");

        if (! config('shop.reports.daily_sales.enabled', true)) {
            Log::warning('[DAILY REPORT] Reports are disabled in config');

            return;
        }

        $orders = Order::with(['items.product', 'user'])
            ->completedToday()
            ->get();

        $reportData = $salesReportService->generate($orders);

        Log::info("[DAILY REPORT] Completed orders: {$reportData->totalOrders} | Revenue: \$".number_format($reportData->totalRevenue, 2)." | Items sold: {$reportData->totalItemsSold}");

        Mail::to($adminEmail)->send(new DailySalesReport($reportData));

        $this->cacheNotification($reportData);

        Log::info("[DAILY REPORT] Email sent to {$adminEmail}");
    }

    private function cacheNotification(SalesReportData $reportData): void
    {
        $notifications = Cache::get('daily_sales_notifications', []);
        $notifications[] = [
            'id' => uniqid(),
            'date' => today()->format('Y-m-d'),
            'total_orders' => $reportData->totalOrders,
            'total_revenue' => $reportData->totalRevenue,
            'total_items' => $reportData->totalItemsSold,
            'products_sold' => $reportData->productsSold->toArray(),
            'message' => "Daily report: {$reportData->totalOrders} orders, \$".number_format($reportData->totalRevenue, 2).' revenue',
            'sent_at' => now()->toISOString(),
        ];

        $maxCached = config('shop.reports.daily_sales.max_cached', 7);
        $notifications = array_slice($notifications, -$maxCached);
        Cache::put('daily_sales_notifications', $notifications, now()->addWeek());
    }
}
