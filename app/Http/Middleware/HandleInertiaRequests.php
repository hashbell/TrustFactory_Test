<?php

namespace App\Http\Middleware;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $lowStockThreshold = config('shop.stock.low_stock_threshold', 5);

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'shopConfig' => [
                'lowStockThreshold' => $lowStockThreshold,
                'perPage' => config('shop.pagination.per_page', 12),
                'dailyReportTime' => config('shop.reports.daily_sales.time', '18:00'),
            ],
            // Admin-only: Low stock notifications and counts
            'adminNotifications' => $user?->isAdmin() ? [
                'lowStockCount' => Product::where('stock_quantity', '>', 0)
                    ->where('stock_quantity', '<=', $lowStockThreshold)
                    ->count(),
                'soldOutCount' => Product::where('stock_quantity', 0)->count(),
                'recentAlerts' => Cache::get('low_stock_notifications', []),
                'recentReports' => Cache::get('daily_sales_notifications', []),
            ] : null,
        ];
    }
}
