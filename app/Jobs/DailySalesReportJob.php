<?php

namespace App\Jobs;

use App\Mail\DailySalesReport;
use App\Models\Order;
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

    public function handle(): void
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

        $report = new DailySalesReport($orders);
        $totalOrders = $report->getTotalOrders();
        $totalRevenue = $report->getTotalRevenue();
        $totalItems = $report->getTotalItemsSold();

        Log::info("[DAILY REPORT] Completed orders: {$totalOrders} | Revenue: \$".number_format($totalRevenue, 2)." | Items sold: {$totalItems}");

        Mail::to($adminEmail)->send($report);

        $this->cacheNotification($report);

        Log::info("[DAILY REPORT] Email sent to {$adminEmail}");
    }

    private function cacheNotification(DailySalesReport $report): void
    {
        $notifications = Cache::get('daily_sales_notifications', []);
        $notifications[] = [
            'id' => uniqid(),
            'date' => today()->format('Y-m-d'),
            'total_orders' => $report->getTotalOrders(),
            'total_revenue' => $report->getTotalRevenue(),
            'total_items' => $report->getTotalItemsSold(),
            'products_sold' => $report->getProductsSold()->toArray(),
            'message' => "Daily report: {$report->getTotalOrders()} orders, \$".number_format($report->getTotalRevenue(), 2).' revenue',
            'sent_at' => now()->toISOString(),
        ];

        $maxCached = config('shop.reports.daily_sales.max_cached', 7);
        $notifications = array_slice($notifications, -$maxCached);
        Cache::put('daily_sales_notifications', $notifications, now()->addWeek());
    }
}
