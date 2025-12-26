<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_cart_page_requires_authentication(): void
    {
        $response = $this->get('/cart');

        $response->assertRedirect('/login');
    }

    public function test_cart_page_loads_for_authenticated_user(): void
    {
        $response = $this->actingAs($this->user)->get('/cart');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Cart/Index')
            ->has('cart')
            ->has('cartItems')
        );
    }

    public function test_add_to_cart_adds_product(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 10]);

        $response = $this->actingAs($this->user)->post('/cart', [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Product added to cart.');

        $this->assertDatabaseHas('cart_items', [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);
    }

    public function test_add_to_cart_validates_product_id(): void
    {
        $response = $this->actingAs($this->user)->post('/cart', [
            'product_id' => 999,
            'quantity' => 1,
        ]);

        $response->assertSessionHasErrors('product_id');
    }

    public function test_add_to_cart_validates_quantity(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 10]);

        $response = $this->actingAs($this->user)->post('/cart', [
            'product_id' => $product->id,
            'quantity' => 0,
        ]);

        $response->assertSessionHasErrors('quantity');
    }

    public function test_add_to_cart_rejects_out_of_stock_product(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 0]);

        $response = $this->actingAs($this->user)->post('/cart', [
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        $response->assertSessionHasErrors('error');
    }

    public function test_update_cart_item_quantity(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 10]);

        // Add to cart first
        $this->actingAs($this->user)->post('/cart', [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        // Update quantity
        $response = $this->actingAs($this->user)->patch("/cart/{$product->id}", [
            'quantity' => 5,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Cart updated.');

        $this->assertDatabaseHas('cart_items', [
            'product_id' => $product->id,
            'quantity' => 5,
        ]);
    }

    public function test_update_cart_item_validates_quantity(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 10]);

        $this->actingAs($this->user)->post('/cart', [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $response = $this->actingAs($this->user)->patch("/cart/{$product->id}", [
            'quantity' => 0,
        ]);

        $response->assertSessionHasErrors('quantity');
    }

    public function test_remove_item_from_cart(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 10]);

        $this->actingAs($this->user)->post('/cart', [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $response = $this->actingAs($this->user)->delete("/cart/{$product->id}");

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Item removed from cart.');

        $this->assertDatabaseMissing('cart_items', [
            'product_id' => $product->id,
        ]);
    }

    public function test_clear_cart(): void
    {
        $products = Product::factory()->count(3)->create(['stock_quantity' => 10]);

        foreach ($products as $product) {
            $this->actingAs($this->user)->post('/cart', [
                'product_id' => $product->id,
                'quantity' => 1,
            ]);
        }

        $response = $this->actingAs($this->user)->post('/cart/clear');

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Cart cleared.');

        // Verify cart is empty by checking database
        $this->user->refresh();
        $this->assertEquals(0, $this->user->cart->items()->count());
    }
}
