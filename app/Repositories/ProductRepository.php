<?php

namespace App\Repositories;

use App\Contracts\Repositories\ProductRepositoryInterface;
use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ProductRepository implements ProductRepositoryInterface
{
    public function all(): Collection
    {
        return Product::latest()->get();
    }

    public function paginated(int $perPage, string $sort = 'latest'): LengthAwarePaginator
    {
        $query = Product::query();

        match ($sort) {
            'price-asc' => $query->orderBy('price', 'asc'),
            'price-desc' => $query->orderBy('price', 'desc'),
            default => $query->latest(),
        };

        return $query->paginate($perPage);
    }

    public function find(int $id): ?Product
    {
        return Product::find($id);
    }

    public function findOrFail(int $id): Product
    {
        return Product::findOrFail($id);
    }

    public function create(array $data): Product
    {
        return Product::create($data);
    }

    public function update(Product $product, array $data): bool
    {
        return $product->update($data);
    }

    public function delete(Product $product): bool
    {
        return $product->delete();
    }

    public function decrementStock(int $productId, int $quantity): bool
    {
        return Product::where('id', $productId)
            ->where('stock_quantity', '>=', $quantity)
            ->decrement('stock_quantity', $quantity) > 0;
    }
}
