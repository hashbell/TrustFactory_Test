<?php

namespace Tests\Unit\Jobs;

use App\Jobs\DailySalesReportJob;
use App\Mail\DailySalesReport;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Services\CartService;
use App\Services\CheckoutService;
use App\Services\SalesReportService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class DailySalesReportJobTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Queue::fake();
    }

    private function createOrderForToday(): Order
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock_quantity' => 10, 'price' => 50.00]);

        $cartService = app(CartService::class);
        $checkoutService = app(CheckoutService::class);

        $cartService->addToCart($user, $product->id, 2);
        $user->refresh();

        return $checkoutService->checkout($user);
    }

    public function test_job_sends_daily_sales_email(): void
    {
        Mail::fake();
        $this->createOrderForToday();

        $job = new DailySalesReportJob;
        $job->handle(app(SalesReportService::class));

        Mail::assertSent(DailySalesReport::class);
    }

    public function test_job_sends_email_to_admin(): void
    {
        Mail::fake();
        config(['shop.admin.email' => 'admin@test.com']);

        $job = new DailySalesReportJob;
        $job->handle(app(SalesReportService::class));

        Mail::assertSent(DailySalesReport::class, function ($mail) {
            return $mail->hasTo('admin@test.com');
        });
    }

    public function test_job_does_not_send_email_when_disabled(): void
    {
        Mail::fake();
        config(['shop.reports.daily_sales.enabled' => false]);

        $job = new DailySalesReportJob;
        $job->handle(app(SalesReportService::class));

        Mail::assertNothingSent();
    }

    public function test_job_includes_todays_orders_only(): void
    {
        Mail::fake();

        // Create order for today
        $this->createOrderForToday();

        // Create order for yesterday (manually)
        $user = User::factory()->create();
        Order::factory()->create([
            'user_id' => $user->id,
            'created_at' => now()->subDay(),
            'status' => Order::STATUS_COMPLETED,
        ]);

        $job = new DailySalesReportJob;
        $job->handle(app(SalesReportService::class));

        Mail::assertSent(DailySalesReport::class, function ($mail) {
            return $mail->reportData->totalOrders === 1;
        });
    }

    public function test_job_sends_report_with_zero_orders(): void
    {
        Mail::fake();

        $job = new DailySalesReportJob;
        $job->handle(app(SalesReportService::class));

        Mail::assertSent(DailySalesReport::class, function ($mail) {
            return $mail->reportData->totalOrders === 0;
        });
    }
}
