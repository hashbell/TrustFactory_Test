<?php

namespace App\Services;

use App\Contracts\Repositories\CartRepositoryInterface;
use App\Contracts\Repositories\OrderRepositoryInterface;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class CheckoutService
{
    public function __construct(
        private readonly CartRepositoryInterface $cartRepository,
        private readonly OrderRepositoryInterface $orderRepository,
        private readonly ProductService $productService
    ) {}

    public function checkout(User $user): Order
    {
        $cart = $this->cartRepository->getCartWithItems($user);

        if ($cart->isEmpty()) {
            throw new InvalidArgumentException('Cart is empty.');
        }

        return DB::transaction(function () use ($user, $cart) {
            // Validate stock availability
            foreach ($cart->items as $item) {
                if ($item->product->stock_quantity < $item->quantity) {
                    throw new InvalidArgumentException(
                        "Insufficient stock for {$item->product->name}. Available: {$item->product->stock_quantity}"
                    );
                }
            }

            // Create order, order items and update stock quantities
            $order = $this->orderRepository->create($user, $cart->total);

            foreach ($cart->items as $item) {
                $this->orderRepository->addItem(
                    $order,
                    $item->product_id,
                    $item->quantity,
                    (float) $item->product->price
                );

                // Decrement stock and check for low stock notification
                $this->productService->decrementStock($item->product_id, $item->quantity);
            }

            // Mark order as completed
            $this->orderRepository->markAsCompleted($order);

            // Clear cart
            $this->cartRepository->clearCart($cart);

            return $order->fresh(['items.product']);
        });
    }

    public function getOrderHistory(User $user)
    {
        return $this->orderRepository->getOrdersForUser($user);
    }

    public function getOrder(User $user, int $orderId): ?Order
    {
        return $this->orderRepository->findForUser($user, $orderId);
    }
}
