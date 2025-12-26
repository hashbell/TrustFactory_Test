<?php

namespace Tests\Feature\Admin;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private User $regularUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['is_admin' => true]);
        $this->regularUser = User::factory()->create(['is_admin' => false]);
    }

    public function test_admin_products_index_requires_authentication(): void
    {
        $response = $this->get('/admin/products');

        $response->assertRedirect('/login');
    }

    public function test_admin_products_index_requires_admin_role(): void
    {
        $response = $this->actingAs($this->regularUser)->get('/admin/products');

        $response->assertStatus(403);
    }

    public function test_admin_products_index_loads_for_admin(): void
    {
        Product::factory()->count(5)->create();

        $response = $this->actingAs($this->admin)->get('/admin/products');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Products/Index')
            ->has('products.data', 5)
            ->where('products.total', 5)
        );
    }

    public function test_admin_products_create_page_loads(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/products/create');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Products/Create')
        );
    }

    public function test_admin_can_create_product(): void
    {
        $response = $this->actingAs($this->admin)->post('/admin/products', [
            'name' => 'New Product',
            'description' => 'A great product',
            'price' => 99.99,
            'stock_quantity' => 50,
            'image_url' => 'https://example.com/image.jpg',
        ]);

        $response->assertRedirect('/admin/products');
        $response->assertSessionHas('success', 'Product created successfully!');

        $this->assertDatabaseHas('products', [
            'name' => 'New Product',
            'price' => 99.99,
            'stock_quantity' => 50,
        ]);
    }

    public function test_create_product_validates_required_fields(): void
    {
        $response = $this->actingAs($this->admin)->post('/admin/products', []);

        $response->assertSessionHasErrors(['name', 'price', 'stock_quantity']);
    }

    public function test_create_product_validates_price_minimum(): void
    {
        $response = $this->actingAs($this->admin)->post('/admin/products', [
            'name' => 'Product',
            'price' => 0,
            'stock_quantity' => 10,
        ]);

        $response->assertSessionHasErrors('price');
    }

    public function test_create_product_validates_image_url_format(): void
    {
        $response = $this->actingAs($this->admin)->post('/admin/products', [
            'name' => 'Product',
            'price' => 10.00,
            'stock_quantity' => 10,
            'image_url' => 'not-a-valid-url',
        ]);

        $response->assertSessionHasErrors('image_url');
    }

    public function test_admin_products_edit_page_loads(): void
    {
        $product = Product::factory()->create();

        $response = $this->actingAs($this->admin)->get("/admin/products/{$product->id}/edit");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Products/Edit')
            ->has('product')
            ->where('product.id', $product->id)
        );
    }

    public function test_admin_can_update_product(): void
    {
        $product = Product::factory()->create([
            'name' => 'Old Name',
            'price' => 50.00,
        ]);

        $response = $this->actingAs($this->admin)->put("/admin/products/{$product->id}", [
            'name' => 'Updated Name',
            'price' => 75.00,
            'stock_quantity' => 20,
        ]);

        $response->assertRedirect('/admin/products');
        $response->assertSessionHas('success', 'Product updated successfully!');

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'Updated Name',
            'price' => 75.00,
        ]);
    }

    public function test_admin_can_delete_product(): void
    {
        $product = Product::factory()->create();

        $response = $this->actingAs($this->admin)->delete("/admin/products/{$product->id}");

        $response->assertRedirect('/admin/products');
        $response->assertSessionHas('success', 'Product deleted successfully!');

        $this->assertDatabaseMissing('products', [
            'id' => $product->id,
        ]);
    }

    public function test_regular_user_cannot_create_product(): void
    {
        $response = $this->actingAs($this->regularUser)->post('/admin/products', [
            'name' => 'Product',
            'price' => 10.00,
            'stock_quantity' => 10,
        ]);

        $response->assertStatus(403);
    }

    public function test_regular_user_cannot_update_product(): void
    {
        $product = Product::factory()->create();

        $response = $this->actingAs($this->regularUser)->put("/admin/products/{$product->id}", [
            'name' => 'Updated',
            'price' => 10.00,
            'stock_quantity' => 10,
        ]);

        $response->assertStatus(403);
    }

    public function test_regular_user_cannot_delete_product(): void
    {
        $product = Product::factory()->create();

        $response = $this->actingAs($this->regularUser)->delete("/admin/products/{$product->id}");

        $response->assertStatus(403);
    }
}
