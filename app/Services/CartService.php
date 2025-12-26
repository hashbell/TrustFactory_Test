<?php

namespace App\Services;

use App\Contracts\Repositories\CartRepositoryInterface;
use App\Contracts\Repositories\ProductRepositoryInterface;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\User;
use InvalidArgumentException;

class CartService
{
    public function __construct(
        private readonly CartRepositoryInterface $cartRepository,
        private readonly ProductRepositoryInterface $productRepository
    ) {}

    public function getCart(User $user): Cart
    {
        return $this->cartRepository->getCartWithItems($user);
    }

    public function addToCart(User $user, int $productId, int $quantity = 1): CartItem
    {
        $product = $this->productRepository->findOrFail($productId);

        if ($product->stock_quantity < 1) {
            throw new InvalidArgumentException('Product is out of stock.');
        }

        if ($product->stock_quantity < $quantity) {
            throw new InvalidArgumentException('Requested quantity exceeds available stock.');
        }

        $cart = $this->cartRepository->getCartForUser($user);

        return $this->cartRepository->addItem($cart, $productId, $quantity);
    }

    public function updateQuantity(User $user, int $productId, int $quantity): CartItem
    {
        if ($quantity < 1) {
            throw new InvalidArgumentException('Quantity must be at least 1.');
        }

        $product = $this->productRepository->findOrFail($productId);

        if ($product->stock_quantity < $quantity) {
            throw new InvalidArgumentException('Requested quantity exceeds available stock.');
        }

        $cart = $this->cartRepository->getCartForUser($user);
        $cartItem = $this->cartRepository->findCartItem($cart, $productId);

        if (! $cartItem) {
            throw new InvalidArgumentException('Item not found in cart.');
        }

        return $this->cartRepository->updateItemQuantity($cartItem, $quantity);
    }

    public function removeFromCart(User $user, int $productId): bool
    {
        $cart = $this->cartRepository->getCartForUser($user);
        $cartItem = $this->cartRepository->findCartItem($cart, $productId);

        if (! $cartItem) {
            throw new InvalidArgumentException('Item not found in cart.');
        }

        return $this->cartRepository->removeItem($cartItem);
    }

    public function clearCart(User $user): bool
    {
        $cart = $this->cartRepository->getCartForUser($user);

        return $this->cartRepository->clearCart($cart);
    }
}
