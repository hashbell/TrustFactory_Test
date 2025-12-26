<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_products_index_page_loads(): void
    {
        Product::factory()->count(5)->create();

        $response = $this->get('/products');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Products/Index')
            ->has('products.data', 5)
        );
    }

    public function test_products_index_paginates_correctly(): void
    {
        Product::factory()->count(15)->create();

        $response = $this->get('/products');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Products/Index')
            ->has('products.data', 12)
            ->where('products.total', 15)
        );
    }

    public function test_product_show_page_loads(): void
    {
        $product = Product::factory()->create([
            'name' => 'Test Product',
            'price' => 99.99,
        ]);

        $response = $this->get("/products/{$product->id}");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Products/Show')
            ->has('product')
            ->where('product.name', 'Test Product')
            ->where('product.price', '99.99')
        );
    }

    public function test_product_show_returns_404_for_invalid_id(): void
    {
        $response = $this->get('/products/999');

        $response->assertStatus(404);
    }
}
