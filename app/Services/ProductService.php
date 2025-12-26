<?php

namespace App\Services;

use App\Contracts\Repositories\ProductRepositoryInterface;
use App\Jobs\LowStockNotificationJob;
use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ProductService
{
    public function __construct(
        private readonly ProductRepositoryInterface $productRepository
    ) {}

    public function getAllProducts(): Collection
    {
        return $this->productRepository->all();
    }

    public function getPaginatedProducts(int $perPage, string $sort = 'latest'): LengthAwarePaginator
    {
        return $this->productRepository->paginated($perPage, $sort);
    }

    public function getProduct(int $id): Product
    {
        return $this->productRepository->findOrFail($id);
    }

    public function createProduct(array $data): Product
    {
        return $this->productRepository->create($data);
    }

    public function updateProduct(Product $product, array $data): bool
    {
        return $this->productRepository->update($product, $data);
    }

    public function deleteProduct(Product $product): bool
    {
        return $this->productRepository->delete($product);
    }

    public function decrementStock(int $productId, int $quantity): bool
    {
        $result = $this->productRepository->decrementStock($productId, $quantity);

        if ($result) {
            $this->checkLowStock($productId);
        }

        return $result;
    }

    private function checkLowStock(int $productId): void
    {
        $product = $this->productRepository->find($productId);
        $threshold = config('shop.stock.low_stock_threshold', 5);

        if ($product && $product->stock_quantity <= $threshold && $product->stock_quantity > 0) {
            LowStockNotificationJob::dispatch($product);
        }
    }
}
