<?php

namespace App\DTOs;

use Illuminate\Support\Collection;

readonly class SalesReportData
{
    /**
     * @param  Collection<int, array{id: int, name: string, quantity: int, revenue: float}>  $productsSold
     */
    public function __construct(
        public float $totalRevenue,
        public int $totalOrders,
        public int $totalItemsSold,
        public Collection $productsSold,
        public string $date,
    ) {}
}
