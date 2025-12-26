<?php

namespace App\Jobs;

use App\Mail\LowStockNotification;
use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class LowStockNotificationJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public function __construct(
        public readonly Product $product
    ) {}

    public function handle(): void
    {
        $adminEmail = config('shop.admin.email');

        Log::info('[LOW STOCK] Notification triggered');
        Log::info("[LOW STOCK] Product: {$this->product->name} (ID: {$this->product->id})");
        Log::info("[LOW STOCK] Current stock: {$this->product->stock_quantity} units | Price: \${$this->product->price}");
        Log::info("[LOW STOCK] Recipient: {$adminEmail}");

        if (! config('shop.notifications.low_stock.enabled', true)) {
            Log::warning('[LOW STOCK] Notifications are disabled in config');

            return;
        }

        Mail::to($adminEmail)->send(new LowStockNotification($this->product));

        $this->cacheNotification();

        Log::info('[LOW STOCK] Email sent successfully');
    }

    private function cacheNotification(): void
    {
        $notifications = Cache::get('low_stock_notifications', []);
        $notifications[] = [
            'id' => uniqid(),
            'product_id' => $this->product->id,
            'product_name' => $this->product->name,
            'stock_quantity' => $this->product->stock_quantity,
            'message' => "Low stock alert: {$this->product->name} has only {$this->product->stock_quantity} units left!",
            'sent_at' => now()->toISOString(),
        ];

        $maxCached = config('shop.notifications.low_stock.max_cached', 10);
        $notifications = array_slice($notifications, -$maxCached);
        Cache::put('low_stock_notifications', $notifications, now()->addDay());
    }
}
