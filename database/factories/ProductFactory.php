<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $products = [
            ['name' => 'Wireless Bluetooth Headphones', 'description' => 'Premium noise-canceling wireless headphones with 30-hour battery life.'],
            ['name' => 'Mechanical Gaming Keyboard', 'description' => 'RGB backlit mechanical keyboard with Cherry MX switches.'],
            ['name' => 'Ultra-Wide Monitor 34"', 'description' => 'Curved ultra-wide monitor with QHD resolution and 144Hz refresh rate.'],
            ['name' => 'Ergonomic Office Chair', 'description' => 'Adjustable ergonomic chair with lumbar support and breathable mesh.'],
            ['name' => 'Smart Watch Pro', 'description' => 'Fitness tracking smartwatch with heart rate monitor and GPS.'],
            ['name' => 'Portable Power Bank 20000mAh', 'description' => 'High-capacity power bank with fast charging support.'],
            ['name' => 'Wireless Mouse', 'description' => 'Precision wireless mouse with adjustable DPI and silent clicks.'],
            ['name' => 'USB-C Hub 7-in-1', 'description' => 'Multi-port adapter with HDMI, USB-A, SD card reader, and PD charging.'],
            ['name' => 'Noise Canceling Earbuds', 'description' => 'True wireless earbuds with active noise cancellation.'],
            ['name' => 'Laptop Stand Adjustable', 'description' => 'Aluminum laptop stand with adjustable height and angle.'],
            ['name' => 'Webcam 4K Ultra HD', 'description' => 'Professional webcam with 4K resolution and auto-focus.'],
            ['name' => 'Gaming Mouse Pad XL', 'description' => 'Extra-large mouse pad with stitched edges and non-slip base.'],
            ['name' => 'Bluetooth Speaker', 'description' => 'Waterproof portable speaker with 360-degree sound.'],
            ['name' => 'Phone Holder Stand', 'description' => 'Adjustable phone stand for desk with cable management.'],
            ['name' => 'LED Desk Lamp', 'description' => 'Smart LED lamp with adjustable brightness and color temperature.'],
        ];

        $product = fake()->randomElement($products);

        return [
            'name' => $product['name'],
            'description' => $product['description'],
            'price' => fake()->randomFloat(2, 19.99, 499.99),
            'stock_quantity' => fake()->numberBetween(0, 100),
            'image_url' => 'https://picsum.photos/seed/'.fake()->uuid().'/400/400',
        ];
    }

    /**
     * Indicate that the product has low stock.
     */
    public function lowStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => fake()->numberBetween(1, 5),
        ]);
    }

    /**
     * Indicate that the product is out of stock.
     */
    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => 0,
        ]);
    }
}
