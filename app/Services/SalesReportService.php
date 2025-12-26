<?php

namespace App\Services;

use App\DTOs\SalesReportData;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Collection as SupportCollection;

class SalesReportService
{
    /**
     * Generate sales report data from a collection of orders.
     *
     * @param  Collection<int, Order>  $orders
     */
    public function generate(Collection $orders): SalesReportData
    {
        return new SalesReportData(
            totalRevenue: $this->calculateTotalRevenue($orders),
            totalOrders: $orders->count(),
            totalItemsSold: $this->calculateTotalItemsSold($orders),
            productsSold: $this->aggregateProductsSold($orders),
            date: now()->format('F j, Y'),
        );
    }

    /**
     * @param  Collection<int, Order>  $orders
     */
    private function calculateTotalRevenue(Collection $orders): float
    {
        return $orders->sum('total_amount');
    }

    /**
     * @param  Collection<int, Order>  $orders
     */
    private function calculateTotalItemsSold(Collection $orders): int
    {
        return $orders->flatMap(fn (Order $order) => $order->items)->sum('quantity');
    }

    /**
     * @param  Collection<int, Order>  $orders
     * @return SupportCollection<int, array{id: int, name: string, quantity: int, revenue: float}>
     */
    private function aggregateProductsSold(Collection $orders): SupportCollection
    {
        /** @var SupportCollection<int, OrderItem> $allItems */
        $allItems = $orders->flatMap(fn (Order $order) => $order->items);

        return $allItems
            ->groupBy('product_id')
            ->map(function (SupportCollection $items): array {
                /** @var OrderItem $first */
                $first = $items->first();

                return [
                    'id' => $first->product_id,
                    'name' => $first->product->name,
                    'quantity' => (int) $items->sum('quantity'),
                    'revenue' => (float) $items->sum(fn (OrderItem $item) => $item->quantity * $item->price),
                ];
            })
            ->sortByDesc('quantity')
            ->values();
    }
}
