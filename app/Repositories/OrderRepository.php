<?php

namespace App\Repositories;

use App\Contracts\Repositories\OrderRepositoryInterface;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class OrderRepository implements OrderRepositoryInterface
{
    public function create(User $user, float $totalAmount): Order
    {
        /** @var Order */
        return $user->orders()->create([
            'total_amount' => $totalAmount,
            'status' => Order::STATUS_PENDING,
        ]);
    }

    public function addItem(Order $order, int $productId, int $quantity, float $price): void
    {
        $order->items()->create([
            'product_id' => $productId,
            'quantity' => $quantity,
            'price' => $price,
        ]);
    }

    public function findForUser(User $user, int $orderId): ?Order
    {
        /** @var Order|null */
        return $user->orders()->with('items.product')->find($orderId);
    }

    public function getOrdersForUser(User $user): Collection
    {
        return $user->orders()->with('items.product')
            ->orderByDesc('created_at')
            ->get();
    }

    public function markAsCompleted(Order $order): void
    {
        $order->markAsCompleted();
    }
}
