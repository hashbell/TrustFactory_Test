<?php

namespace Tests\Unit\Services;

use App\DTOs\SalesReportData;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Services\SalesReportService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SalesReportServiceTest extends TestCase
{
    use RefreshDatabase;

    private SalesReportService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(SalesReportService::class);
    }

    public function test_generate_returns_sales_report_data(): void
    {
        $orders = Order::query()->with(['items.product'])->get();

        $result = $this->service->generate($orders);

        $this->assertInstanceOf(SalesReportData::class, $result);
    }

    public function test_generate_with_empty_orders_returns_zero_totals(): void
    {
        $orders = Order::query()->with(['items.product'])->get();

        $result = $this->service->generate($orders);

        $this->assertEquals(0.0, $result->totalRevenue);
        $this->assertEquals(0, $result->totalOrders);
        $this->assertEquals(0, $result->totalItemsSold);
        $this->assertTrue($result->productsSold->isEmpty());
    }

    public function test_generate_calculates_total_revenue_correctly(): void
    {
        $user = User::factory()->create();
        Order::factory()
            ->completed()
            ->create(['user_id' => $user->id, 'total_amount' => 100.00]);
        Order::factory()
            ->completed()
            ->create(['user_id' => $user->id, 'total_amount' => 250.50]);

        $orders = Order::query()->with(['items.product'])->get();

        $result = $this->service->generate($orders);

        $this->assertEquals(350.50, $result->totalRevenue);
    }

    public function test_generate_calculates_total_orders_correctly(): void
    {
        $user = User::factory()->create();
        Order::factory()->count(3)->completed()->create(['user_id' => $user->id]);

        $orders = Order::query()->with(['items.product'])->get();

        $result = $this->service->generate($orders);

        $this->assertEquals(3, $result->totalOrders);
    }

    public function test_generate_calculates_total_items_sold_correctly(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();
        $order = Order::factory()->completed()->create(['user_id' => $user->id]);

        OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => 3,
        ]);
        OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $orders = Order::query()->with(['items.product'])->get();

        $result = $this->service->generate($orders);

        $this->assertEquals(5, $result->totalItemsSold);
    }

    public function test_generate_aggregates_products_sold_correctly(): void
    {
        $user = User::factory()->create();
        $productA = Product::factory()->create(['name' => 'Product A', 'price' => 10.00]);
        $productB = Product::factory()->create(['name' => 'Product B', 'price' => 20.00]);
        $order = Order::factory()->completed()->create(['user_id' => $user->id]);

        OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $productA->id,
            'quantity' => 3,
            'price' => 10.00,
        ]);
        OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $productB->id,
            'quantity' => 1,
            'price' => 20.00,
        ]);

        $orders = Order::query()->with(['items.product'])->get();

        $result = $this->service->generate($orders);

        $this->assertCount(2, $result->productsSold);

        // Sorted by quantity descending
        $firstProduct = $result->productsSold->first();
        $this->assertEquals($productA->id, $firstProduct['id']);
        $this->assertEquals('Product A', $firstProduct['name']);
        $this->assertEquals(3, $firstProduct['quantity']);
        $this->assertEquals(30.00, $firstProduct['revenue']);
    }

    public function test_generate_aggregates_same_product_across_multiple_orders(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['name' => 'Same Product', 'price' => 25.00]);

        $order1 = Order::factory()->completed()->create(['user_id' => $user->id]);
        $order2 = Order::factory()->completed()->create(['user_id' => $user->id]);

        OrderItem::factory()->create([
            'order_id' => $order1->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'price' => 25.00,
        ]);
        OrderItem::factory()->create([
            'order_id' => $order2->id,
            'product_id' => $product->id,
            'quantity' => 4,
            'price' => 25.00,
        ]);

        $orders = Order::query()->with(['items.product'])->get();

        $result = $this->service->generate($orders);

        $this->assertCount(1, $result->productsSold);
        $aggregatedProduct = $result->productsSold->first();
        $this->assertEquals(6, $aggregatedProduct['quantity']);
        $this->assertEquals(150.00, $aggregatedProduct['revenue']);
    }

    public function test_generate_sorts_products_by_quantity_descending(): void
    {
        $user = User::factory()->create();
        $productLow = Product::factory()->create(['name' => 'Low Seller']);
        $productHigh = Product::factory()->create(['name' => 'High Seller']);
        $order = Order::factory()->completed()->create(['user_id' => $user->id]);

        OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $productLow->id,
            'quantity' => 1,
            'price' => 10.00,
        ]);
        OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $productHigh->id,
            'quantity' => 10,
            'price' => 10.00,
        ]);

        $orders = Order::query()->with(['items.product'])->get();

        $result = $this->service->generate($orders);

        $this->assertEquals('High Seller', $result->productsSold->first()['name']);
        $this->assertEquals('Low Seller', $result->productsSold->last()['name']);
    }

    public function test_generate_includes_formatted_date(): void
    {
        $orders = Order::query()->with(['items.product'])->get();

        $result = $this->service->generate($orders);

        $this->assertEquals(now()->format('F j, Y'), $result->date);
    }
}
