<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Wireless Bluetooth Headphones',
                'description' => 'Premium noise-canceling wireless headphones with 30-hour battery life. Features advanced ANC technology and comfortable over-ear design.',
                'price' => 199.99,
                'stock_quantity' => 25,
                'image_url' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
            ],
            [
                'name' => 'Mechanical Gaming Keyboard',
                'description' => 'RGB backlit mechanical keyboard with Cherry MX switches. Perfect for gaming and typing with customizable lighting effects.',
                'price' => 149.99,
                'stock_quantity' => 15,
                'image_url' => 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400',
            ],
            [
                'name' => 'Ultra-Wide Monitor 34"',
                'description' => 'Curved ultra-wide monitor with QHD resolution and 144Hz refresh rate. Immersive viewing experience for work and gaming.',
                'price' => 449.99,
                'stock_quantity' => 8,
                'image_url' => 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
            ],
            [
                'name' => 'Ergonomic Office Chair',
                'description' => 'Adjustable ergonomic chair with lumbar support and breathable mesh. Designed for all-day comfort.',
                'price' => 299.99,
                'stock_quantity' => 12,
                'image_url' => 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400',
            ],
            [
                'name' => 'Smart Watch Pro',
                'description' => 'Fitness tracking smartwatch with heart rate monitor, GPS, and sleep tracking. Water-resistant up to 50 meters.',
                'price' => 349.99,
                'stock_quantity' => 30,
                'image_url' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
            ],
            [
                'name' => 'Portable Power Bank 20000mAh',
                'description' => 'High-capacity power bank with fast charging support. Charge multiple devices simultaneously with USB-C and USB-A ports.',
                'price' => 49.99,
                'stock_quantity' => 50,
                'image_url' => 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
            ],
            [
                'name' => 'Wireless Mouse',
                'description' => 'Precision wireless mouse with adjustable DPI and silent clicks. Ergonomic design for comfortable extended use.',
                'price' => 39.99,
                'stock_quantity' => 45,
                'image_url' => 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
            ],
            [
                'name' => 'USB-C Hub 7-in-1',
                'description' => 'Multi-port adapter with HDMI, USB-A, SD card reader, and PD charging. Essential for modern laptop connectivity.',
                'price' => 59.99,
                'stock_quantity' => 35,
                'image_url' => 'https://images.unsplash.com/photo-1625723044792-44de16ccf4e9?w=400',
            ],
            [
                'name' => 'Noise Canceling Earbuds',
                'description' => 'True wireless earbuds with active noise cancellation. Crystal clear audio with 8-hour battery life.',
                'price' => 179.99,
                'stock_quantity' => 4,
                'image_url' => 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
            ],
            [
                'name' => 'Laptop Stand Adjustable',
                'description' => 'Aluminum laptop stand with adjustable height and angle. Improves posture and laptop cooling.',
                'price' => 44.99,
                'stock_quantity' => 28,
                'image_url' => 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
            ],
            [
                'name' => 'Webcam 4K Ultra HD',
                'description' => 'Professional webcam with 4K resolution and auto-focus. Perfect for streaming and video conferencing.',
                'price' => 129.99,
                'stock_quantity' => 18,
                'image_url' => 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400',
            ],
            [
                'name' => 'Gaming Mouse Pad XL',
                'description' => 'Extra-large mouse pad with stitched edges and non-slip base. Smooth surface for precise mouse control.',
                'price' => 24.99,
                'stock_quantity' => 60,
                'image_url' => 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400',
            ],
            [
                'name' => 'Bluetooth Speaker',
                'description' => 'Waterproof portable speaker with 360-degree sound. 12-hour battery life for outdoor adventures.',
                'price' => 89.99,
                'stock_quantity' => 22,
                'image_url' => 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
            ],
            [
                'name' => 'Phone Holder Stand',
                'description' => 'Adjustable phone stand for desk with cable management. Compatible with all smartphone sizes.',
                'price' => 19.99,
                'stock_quantity' => 75,
                'image_url' => 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=400',
            ],
            [
                'name' => 'LED Desk Lamp',
                'description' => 'Smart LED lamp with adjustable brightness and color temperature. USB charging port included.',
                'price' => 54.99,
                'stock_quantity' => 32,
                'image_url' => 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
            ],
            [
                'name' => 'Wireless Charging Pad',
                'description' => 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek minimalist design.',
                'price' => 29.99,
                'stock_quantity' => 40,
                'image_url' => 'https://images.unsplash.com/photo-1586495985433-7c2dc9ce1d44?w=400',
            ],
            // SOLD OUT products (stock_quantity = 0)
            [
                'name' => 'Limited Edition Headphones',
                'description' => 'Exclusive limited edition headphones with premium leather and gold accents. Collector\'s item.',
                'price' => 599.99,
                'stock_quantity' => 0,
                'image_url' => 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400',
            ],
            [
                'name' => 'Vintage Mechanical Watch',
                'description' => 'Classic timepiece with Swiss movement and sapphire crystal. Currently out of production.',
                'price' => 899.99,
                'stock_quantity' => 0,
                'image_url' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
            ],
            // LOW STOCK products (stock_quantity <= 5)
            [
                'name' => 'Premium Leather Wallet',
                'description' => 'Handcrafted Italian leather wallet with RFID protection. Limited availability.',
                'price' => 149.99,
                'stock_quantity' => 3,
                'image_url' => 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400',
            ],
            [
                'name' => 'Titanium Pen Set',
                'description' => 'Luxury titanium ballpoint pen set in presentation box. Only a few remaining.',
                'price' => 199.99,
                'stock_quantity' => 2,
                'image_url' => 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400',
            ],
            [
                'name' => 'Artisan Coffee Maker',
                'description' => 'Hand-blown glass pour-over coffee maker. Last units in stock.',
                'price' => 79.99,
                'stock_quantity' => 5,
                'image_url' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
