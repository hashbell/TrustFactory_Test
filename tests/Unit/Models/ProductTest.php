<?php

namespace Tests\Unit\Models;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_price_is_cast_to_decimal(): void
    {
        $product = Product::factory()->create(['price' => 99.99]);

        $this->assertEquals('99.99', $product->price);
    }

    public function test_stock_quantity_is_cast_to_integer(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 10]);

        $this->assertIsInt($product->stock_quantity);
    }
}
