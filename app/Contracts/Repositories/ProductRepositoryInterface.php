<?php

namespace App\Contracts\Repositories;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface ProductRepositoryInterface
{
    public function all(): Collection;

    public function paginated(int $perPage, string $sort = 'latest'): LengthAwarePaginator;

    public function find(int $id): ?Product;

    public function findOrFail(int $id): Product;

    public function create(array $data): Product;

    public function update(Product $product, array $data): bool;

    public function delete(Product $product): bool;

    public function decrementStock(int $productId, int $quantity): bool;
}
