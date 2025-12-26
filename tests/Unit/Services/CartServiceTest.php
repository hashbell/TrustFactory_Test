<?php

namespace Tests\Unit\Services;

use App\Models\Product;
use App\Models\User;
use App\Services\CartService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use InvalidArgumentException;
use Tests\TestCase;

class CartServiceTest extends TestCase
{
    use RefreshDatabase;

    private CartService $cartService;
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->cartService = app(CartService::class);
        $this->user = User::factory()->create();
    }

    public function test_get_cart_returns_user_cart(): void
    {
        $cart = $this->cartService->getCart($this->user);

        $this->assertNotNull($cart);
        $this->assertEquals($this->user->id, $cart->user_id);
    }

    public function test_add_to_cart_creates_cart_item(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 10]);

        $cartItem = $this->cartService->addToCart($this->user, $product->id, 2);

        $this->assertEquals($product->id, $cartItem->product_id);
        $this->assertEquals(2, $cartItem->quantity);
    }

    public function test_add_to_cart_increments_existing_item_quantity(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 10]);

        $this->cartService->addToCart($this->user, $product->id, 2);

        // Refresh user to get updated cart relationship
        $this->user->refresh();

        $cartItem = $this->cartService->addToCart($this->user, $product->id, 3);

        $this->assertEquals(5, $cartItem->quantity);
    }

    public function test_add_to_cart_throws_exception_for_out_of_stock_product(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 0]);

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Product is out of stock.');

        $this->cartService->addToCart($this->user, $product->id, 1);
    }

    public function test_add_to_cart_throws_exception_when_quantity_exceeds_stock(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 5]);

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Requested quantity exceeds available stock.');

        $this->cartService->addToCart($this->user, $product->id, 10);
    }

    public function test_update_quantity_changes_cart_item_quantity(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 10]);
        $this->cartService->addToCart($this->user, $product->id, 2);
        $this->user->refresh();

        $cartItem = $this->cartService->updateQuantity($this->user, $product->id, 5);

        $this->assertEquals(5, $cartItem->quantity);
    }

    public function test_update_quantity_throws_exception_for_zero_quantity(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 10]);
        $this->cartService->addToCart($this->user, $product->id, 2);
        $this->user->refresh();

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Quantity must be at least 1.');

        $this->cartService->updateQuantity($this->user, $product->id, 0);
    }

    public function test_update_quantity_throws_exception_when_exceeds_stock(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 5]);
        $this->cartService->addToCart($this->user, $product->id, 2);
        $this->user->refresh();

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Requested quantity exceeds available stock.');

        $this->cartService->updateQuantity($this->user, $product->id, 10);
    }

    public function test_update_quantity_throws_exception_for_missing_item(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 10]);

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Item not found in cart.');

        $this->cartService->updateQuantity($this->user, $product->id, 5);
    }

    public function test_remove_from_cart_deletes_cart_item(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 10]);
        $this->cartService->addToCart($this->user, $product->id, 2);
        $this->user->refresh();

        $result = $this->cartService->removeFromCart($this->user, $product->id);

        $this->assertTrue($result);
        $this->assertEquals(0, $this->cartService->getCart($this->user)->items->count());
    }

    public function test_remove_from_cart_throws_exception_for_missing_item(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 10]);

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Item not found in cart.');

        $this->cartService->removeFromCart($this->user, $product->id);
    }

    public function test_clear_cart_removes_all_items(): void
    {
        $products = Product::factory()->count(3)->create(['stock_quantity' => 10]);
        foreach ($products as $product) {
            $this->cartService->addToCart($this->user, $product->id, 1);
            $this->user->refresh();
        }

        $result = $this->cartService->clearCart($this->user);

        $this->assertTrue($result);
        $this->user->refresh();
        $this->assertEquals(0, $this->cartService->getCart($this->user)->items->count());
    }
}
