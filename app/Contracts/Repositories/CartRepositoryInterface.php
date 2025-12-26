<?php

namespace App\Contracts\Repositories;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\User;

interface CartRepositoryInterface
{
    public function getCartForUser(User $user): Cart;

    public function getCartWithItems(User $user): Cart;

    public function addItem(Cart $cart, int $productId, int $quantity = 1): CartItem;

    public function updateItemQuantity(CartItem $item, int $quantity): CartItem;

    public function removeItem(CartItem $item): bool;

    public function findCartItem(Cart $cart, int $productId): ?CartItem;

    public function clearCart(Cart $cart): bool;
}
