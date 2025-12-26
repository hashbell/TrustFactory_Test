<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddToCartRequest;
use App\Http\Requests\UpdateCartItemRequest;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function __construct(
        private readonly CartService $cartService
    ) {}

    public function index(Request $request): Response
    {
        $cart = $this->cartService->getCart($request->user());

        return Inertia::render('Cart/Index', [
            'cart' => $cart,
            'cartItems' => $cart->items,
            'total' => $cart->total,
            'itemCount' => $cart->item_count,
        ]);
    }

    public function store(AddToCartRequest $request): RedirectResponse
    {
        try {
            $this->cartService->addToCart(
                $request->user(),
                $request->validated('product_id'),
                $request->validated('quantity', 1)
            );

            return redirect()->back()->with('success', 'Product added to cart.');
        } catch (\InvalidArgumentException $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function update(UpdateCartItemRequest $request, int $productId): RedirectResponse
    {
        try {
            $this->cartService->updateQuantity(
                $request->user(),
                $productId,
                $request->validated('quantity')
            );

            return redirect()->back()->with('success', 'Cart updated.');
        } catch (\InvalidArgumentException $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function destroy(Request $request, int $productId): RedirectResponse
    {
        try {
            $this->cartService->removeFromCart($request->user(), $productId);

            return redirect()->back()->with('success', 'Item removed from cart.');
        } catch (\InvalidArgumentException $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function clear(Request $request): RedirectResponse
    {
        $this->cartService->clearCart($request->user());

        return redirect()->back()->with('success', 'Cart cleared.');
    }
}
