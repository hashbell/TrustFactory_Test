<?php

namespace Tests\Unit\Services;

use App\Jobs\LowStockNotificationJob;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class ProductServiceTest extends TestCase
{
    use RefreshDatabase;

    private ProductService $productService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->productService = app(ProductService::class);
    }

    public function test_get_product_returns_product(): void
    {
        $product = Product::factory()->create(['name' => 'Test Product']);

        $result = $this->productService->getProduct($product->id);

        $this->assertEquals('Test Product', $result->name);
    }

    public function test_get_product_throws_exception_for_invalid_id(): void
    {
        $this->expectException(\Illuminate\Database\Eloquent\ModelNotFoundException::class);

        $this->productService->getProduct(999);
    }

    public function test_get_paginated_products_returns_paginator(): void
    {
        Product::factory()->count(15)->create();

        $result = $this->productService->getPaginatedProducts(10);

        $this->assertCount(10, $result->items());
        $this->assertEquals(15, $result->total());
    }

    public function test_decrement_stock_reduces_quantity(): void
    {
        Queue::fake();
        $product = Product::factory()->create(['stock_quantity' => 10]);

        $result = $this->productService->decrementStock($product->id, 3);

        $this->assertTrue($result);
        $this->assertEquals(7, $product->fresh()->stock_quantity);
    }

    public function test_decrement_stock_dispatches_low_stock_job_when_threshold_reached(): void
    {
        Queue::fake();
        $product = Product::factory()->create(['stock_quantity' => 6]);

        $this->productService->decrementStock($product->id, 2);

        Queue::assertPushed(LowStockNotificationJob::class, function ($job) use ($product) {
            return $job->product->id === $product->id;
        });
    }

    public function test_decrement_stock_does_not_dispatch_job_when_stock_above_threshold(): void
    {
        Queue::fake();
        $product = Product::factory()->create(['stock_quantity' => 20]);

        $this->productService->decrementStock($product->id, 5);

        Queue::assertNotPushed(LowStockNotificationJob::class);
    }

    public function test_decrement_stock_does_not_dispatch_job_when_stock_is_zero(): void
    {
        Queue::fake();
        $product = Product::factory()->create(['stock_quantity' => 2]);

        $this->productService->decrementStock($product->id, 2);

        Queue::assertNotPushed(LowStockNotificationJob::class);
    }
}
