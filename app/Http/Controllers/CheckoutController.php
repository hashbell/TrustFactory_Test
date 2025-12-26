<?php

namespace App\Http\Controllers;

use App\Services\CheckoutService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function __construct(
        private readonly CheckoutService $checkoutService
    ) {}

    public function store(Request $request): RedirectResponse
    {
        try {
            $order = $this->checkoutService->checkout($request->user());

            return redirect()
                ->route('orders.show', $order->id)
                ->with('success', 'Order placed successfully!');
        } catch (\InvalidArgumentException $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function index(Request $request): Response
    {
        $orders = $this->checkoutService->getOrderHistory($request->user());

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Request $request, int $id): Response
    {
        $order = $this->checkoutService->getOrder($request->user(), $id);

        if (! $order) {
            abort(404);
        }

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }
}
