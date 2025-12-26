<?php

namespace Tests\Unit\Models;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_order_belongs_to_user(): void
    {
        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);

        $this->assertEquals($user->id, $order->user->id);
    }

    public function test_order_has_many_items(): void
    {
        $order = Order::factory()->create();
        $product1 = Product::factory()->create();
        $product2 = Product::factory()->create();

        OrderItem::factory()->create(['order_id' => $order->id, 'product_id' => $product1->id]);
        OrderItem::factory()->create(['order_id' => $order->id, 'product_id' => $product2->id]);

        $this->assertCount(2, $order->items);
    }

    public function test_mark_as_completed_updates_status(): void
    {
        $order = Order::factory()->create(['status' => Order::STATUS_PENDING]);

        $order->markAsCompleted();

        $this->assertEquals(Order::STATUS_COMPLETED, $order->fresh()->status);
    }

    public function test_completed_today_scope_returns_only_todays_completed_orders(): void
    {
        // Today's completed order
        Order::factory()->create([
            'status' => Order::STATUS_COMPLETED,
            'created_at' => now(),
        ]);

        // Yesterday's completed order
        Order::factory()->create([
            'status' => Order::STATUS_COMPLETED,
            'created_at' => now()->subDay(),
        ]);

        // Today's pending order
        Order::factory()->create([
            'status' => Order::STATUS_PENDING,
            'created_at' => now(),
        ]);

        $orders = Order::completedToday()->get();

        $this->assertCount(1, $orders);
    }

    public function test_total_amount_is_cast_to_decimal(): void
    {
        $order = Order::factory()->create(['total_amount' => 199.99]);

        $this->assertEquals('199.99', $order->total_amount);
    }
}
