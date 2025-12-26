<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class CheckoutControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        Queue::fake();
        $this->user = User::factory()->create();
    }

    private function addToCart(Product $product, int $quantity = 1): void
    {
        $this->actingAs($this->user)->post('/cart', [
            'product_id' => $product->id,
            'quantity' => $quantity,
        ]);
    }

    public function test_checkout_requires_authentication(): void
    {
        $response = $this->post('/checkout');

        $response->assertRedirect('/login');
    }

    public function test_checkout_creates_order(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 10, 'price' => 99.99]);
        $this->addToCart($product, 2);

        $response = $this->actingAs($this->user)->post('/checkout');

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Order placed successfully!');

        $this->assertDatabaseHas('orders', [
            'user_id' => $this->user->id,
            'status' => Order::STATUS_COMPLETED,
        ]);
    }

    public function test_checkout_redirects_to_order_show_page(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 10]);
        $this->addToCart($product, 1);

        $response = $this->actingAs($this->user)->post('/checkout');

        $order = Order::first();
        $this->assertNotNull($order);
        $response->assertRedirect("/orders/{$order->id}");
    }

    public function test_checkout_fails_with_empty_cart(): void
    {
        $response = $this->actingAs($this->user)->post('/checkout');

        $response->assertRedirect();
        $response->assertSessionHasErrors('error');
    }

    public function test_orders_index_page_loads(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 10]);
        $this->addToCart($product, 1);
        $this->actingAs($this->user)->post('/checkout');

        $response = $this->actingAs($this->user)->get('/orders');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Orders/Index')
            ->has('orders', 1)
        );
    }

    public function test_orders_index_only_shows_user_orders(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 20]);

        // Create order for user
        $this->addToCart($product, 1);
        $this->actingAs($this->user)->post('/checkout');

        // Create order for another user
        $otherUser = User::factory()->create();
        $this->actingAs($otherUser)->post('/cart', [
            'product_id' => $product->id,
            'quantity' => 1,
        ]);
        $this->actingAs($otherUser)->post('/checkout');

        $response = $this->actingAs($this->user)->get('/orders');

        $response->assertInertia(fn ($page) => $page
            ->has('orders', 1)
        );
    }

    public function test_order_show_page_loads(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 10, 'price' => 49.99]);
        $this->addToCart($product, 2);
        $this->actingAs($this->user)->post('/checkout');

        $order = Order::first();
        $this->assertNotNull($order);

        $response = $this->actingAs($this->user)->get("/orders/{$order->id}");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Orders/Show')
            ->has('order')
            ->where('order.id', $order->id)
        );
    }

    public function test_order_show_returns_404_for_other_users_order(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 10]);
        $this->addToCart($product, 1);
        $this->actingAs($this->user)->post('/checkout');

        $order = Order::first();
        $this->assertNotNull($order);

        $otherUser = User::factory()->create();

        $response = $this->actingAs($otherUser)->get("/orders/{$order->id}");

        $response->assertStatus(404);
    }
}
