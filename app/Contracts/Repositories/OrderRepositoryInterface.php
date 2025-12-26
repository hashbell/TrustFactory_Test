<?php

namespace App\Contracts\Repositories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

interface OrderRepositoryInterface
{
    public function create(User $user, float $totalAmount): Order;

    public function addItem(Order $order, int $productId, int $quantity, float $price): void;

    public function findForUser(User $user, int $orderId): ?Order;

    public function getOrdersForUser(User $user): Collection;

    public function markAsCompleted(Order $order): void;
}
