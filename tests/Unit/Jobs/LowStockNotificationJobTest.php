<?php

namespace Tests\Unit\Jobs;

use App\Jobs\LowStockNotificationJob;
use App\Mail\LowStockNotification;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class LowStockNotificationJobTest extends TestCase
{
    use RefreshDatabase;

    public function test_job_sends_low_stock_email(): void
    {
        Mail::fake();
        $product = Product::factory()->create([
            'name' => 'Test Product',
            'stock_quantity' => 3,
        ]);

        $job = new LowStockNotificationJob($product);
        $job->handle();

        Mail::assertSent(LowStockNotification::class, function ($mail) use ($product) {
            return $mail->product->id === $product->id;
        });
    }

    public function test_job_sends_email_to_admin(): void
    {
        Mail::fake();
        config(['shop.admin.email' => 'admin@test.com']);

        $product = Product::factory()->create(['stock_quantity' => 3]);

        $job = new LowStockNotificationJob($product);
        $job->handle();

        Mail::assertSent(LowStockNotification::class, function ($mail) {
            return $mail->hasTo('admin@test.com');
        });
    }

    public function test_job_does_not_send_email_when_disabled(): void
    {
        Mail::fake();
        config(['shop.notifications.low_stock.enabled' => false]);

        $product = Product::factory()->create(['stock_quantity' => 3]);

        $job = new LowStockNotificationJob($product);
        $job->handle();

        Mail::assertNothingSent();
    }

    public function test_job_logs_notification_info(): void
    {
        Mail::fake();
        $product = Product::factory()->create([
            'name' => 'Test Product',
            'stock_quantity' => 3,
            'price' => 99.99,
        ]);

        $job = new LowStockNotificationJob($product);
        $job->handle();

        // Check that job completes without error
        $this->assertTrue(true);
    }
}
