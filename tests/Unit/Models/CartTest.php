<?php

namespace Tests\Unit\Models;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartTest extends TestCase
{
    use RefreshDatabase;

    public function test_cart_belongs_to_user(): void
    {
        $user = User::factory()->create();
        $cart = Cart::factory()->create(['user_id' => $user->id]);

        $this->assertEquals($user->id, $cart->user->id);
    }

    public function test_cart_has_many_items(): void
    {
        $cart = Cart::factory()->create();
        $product1 = Product::factory()->create();
        $product2 = Product::factory()->create();

        CartItem::factory()->create(['cart_id' => $cart->id, 'product_id' => $product1->id]);
        CartItem::factory()->create(['cart_id' => $cart->id, 'product_id' => $product2->id]);

        $this->assertCount(2, $cart->items);
    }

    public function test_cart_total_calculates_correctly(): void
    {
        $cart = Cart::factory()->create();
        $product1 = Product::factory()->create(['price' => 25.00]);
        $product2 = Product::factory()->create(['price' => 15.00]);

        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_id' => $product1->id,
            'quantity' => 2,
        ]);
        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_id' => $product2->id,
            'quantity' => 3,
        ]);

        // 25 * 2 + 15 * 3 = 50 + 45 = 95
        $this->assertEquals(95.00, $cart->fresh()->total);
    }

    public function test_cart_item_count_returns_total_quantity(): void
    {
        $cart = Cart::factory()->create();
        $product1 = Product::factory()->create();
        $product2 = Product::factory()->create();

        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_id' => $product1->id,
            'quantity' => 2,
        ]);
        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_id' => $product2->id,
            'quantity' => 3,
        ]);

        $this->assertEquals(5, $cart->fresh()->item_count);
    }

    public function test_is_empty_returns_true_for_empty_cart(): void
    {
        $cart = Cart::factory()->create();

        $this->assertTrue($cart->isEmpty());
    }

    public function test_is_empty_returns_false_for_non_empty_cart(): void
    {
        $cart = Cart::factory()->create();
        $product = Product::factory()->create();
        CartItem::factory()->create(['cart_id' => $cart->id, 'product_id' => $product->id]);

        $this->assertFalse($cart->fresh()->isEmpty());
    }
}
