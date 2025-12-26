<?php

namespace Tests\Unit\Services;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Services\CartService;
use App\Services\CheckoutService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use InvalidArgumentException;
use Tests\TestCase;

class CheckoutServiceTest extends TestCase
{
    use RefreshDatabase;

    private CheckoutService $checkoutService;

    private CartService $cartService;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        Queue::fake();
        $this->checkoutService = app(CheckoutService::class);
        $this->cartService = app(CartService::class);
        $this->user = User::factory()->create();
    }

    private function addToCartAndRefresh(int $productId, int $quantity = 1): void
    {
        $this->cartService->addToCart($this->user, $productId, $quantity);
        $this->user->refresh();
    }

    public function test_checkout_creates_order(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 10, 'price' => 99.99]);
        $this->addToCartAndRefresh($product->id, 2);

        $order = $this->checkoutService->checkout($this->user);

        $this->assertInstanceOf(Order::class, $order);
        $this->assertEquals($this->user->id, $order->user_id);
        $this->assertEquals(Order::STATUS_COMPLETED, $order->status);
    }

    public function test_checkout_creates_order_items(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 10, 'price' => 50.00]);
        $this->addToCartAndRefresh($product->id, 3);

        $order = $this->checkoutService->checkout($this->user);

        $this->assertCount(1, $order->items);
        $this->assertEquals($product->id, $order->items->first()->product_id);
        $this->assertEquals(3, $order->items->first()->quantity);
        $this->assertEquals(50.00, $order->items->first()->price);
    }

    public function test_checkout_calculates_correct_total(): void
    {
        $product1 = Product::factory()->create(['stock_quantity' => 10, 'price' => 25.00]);
        $product2 = Product::factory()->create(['stock_quantity' => 10, 'price' => 15.00]);
        $this->addToCartAndRefresh($product1->id, 2); // 50.00
        $this->addToCartAndRefresh($product2->id, 3); // 45.00

        $order = $this->checkoutService->checkout($this->user);

        $this->assertEquals(95.00, $order->total_amount);
    }

    public function test_checkout_decrements_product_stock(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 10]);
        $this->addToCartAndRefresh($product->id, 3);

        $this->checkoutService->checkout($this->user);

        $this->assertEquals(7, $product->fresh()->stock_quantity);
    }

    public function test_checkout_clears_cart(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 10]);
        $this->addToCartAndRefresh($product->id, 2);

        $this->checkoutService->checkout($this->user);
        $this->user->refresh();

        $this->assertEquals(0, $this->cartService->getCart($this->user)->items->count());
    }

    public function test_checkout_throws_exception_for_empty_cart(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Cart is empty.');

        $this->checkoutService->checkout($this->user);
    }

    public function test_checkout_throws_exception_for_insufficient_stock(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 2]);
        $this->addToCartAndRefresh($product->id, 2);

        // Simulate someone else bought the stock
        $product->update(['stock_quantity' => 1]);

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Insufficient stock');

        $this->checkoutService->checkout($this->user);
    }

    public function test_get_order_history_returns_user_orders(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 20]);

        // Create 2 orders
        $this->addToCartAndRefresh($product->id, 1);
        $this->checkoutService->checkout($this->user);
        $this->user->refresh();

        $this->addToCartAndRefresh($product->id, 1);
        $this->checkoutService->checkout($this->user);

        $orders = $this->checkoutService->getOrderHistory($this->user);

        $this->assertCount(2, $orders);
    }

    public function test_get_order_returns_specific_order(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 10]);
        $this->addToCartAndRefresh($product->id, 1);
        $createdOrder = $this->checkoutService->checkout($this->user);

        $order = $this->checkoutService->getOrder($this->user, $createdOrder->id);

        $this->assertEquals($createdOrder->id, $order->id);
    }

    public function test_get_order_returns_null_for_other_users_order(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 10]);
        $this->addToCartAndRefresh($product->id, 1);
        $order = $this->checkoutService->checkout($this->user);

        $otherUser = User::factory()->create();
        $result = $this->checkoutService->getOrder($otherUser, $order->id);

        $this->assertNull($result);
    }
}
