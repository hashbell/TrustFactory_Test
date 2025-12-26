<?php

namespace App\Repositories;

use App\Contracts\Repositories\CartRepositoryInterface;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\User;

class CartRepository implements CartRepositoryInterface
{
    public function getCartForUser(User $user): Cart
    {
        // Used a query to avoid cached relationship issues
        return Cart::firstOrCreate(['user_id' => $user->id]);
    }

    public function getCartWithItems(User $user): Cart
    {
        $cart = $this->getCartForUser($user);

        return $cart->load(['items.product']);
    }

    public function addItem(Cart $cart, int $productId, int $quantity = 1): CartItem
    {
        $existingItem = $this->findCartItem($cart, $productId);

        if ($existingItem) {
            $existingItem->increment('quantity', $quantity);

            return $existingItem->fresh(['product']);
        }

        /** @var CartItem $cartItem */
        $cartItem = $cart->items()->create([
            'product_id' => $productId,
            'quantity' => $quantity,
        ]);

        return $cartItem->load('product');
    }

    public function updateItemQuantity(CartItem $item, int $quantity): CartItem
    {
        $item->update(['quantity' => $quantity]);

        return $item->fresh(['product']);
    }

    public function removeItem(CartItem $item): bool
    {
        return $item->delete();
    }

    public function findCartItem(Cart $cart, int $productId): ?CartItem
    {
        /** @var CartItem|null */
        return $cart->items()->where('product_id', $productId)->first();
    }

    public function clearCart(Cart $cart): bool
    {
        return $cart->items()->delete() >= 0;
    }
}
