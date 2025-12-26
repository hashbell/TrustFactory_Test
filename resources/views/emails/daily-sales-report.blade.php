<x-mail::message>
# Daily Sales Report

**Date:** {{ $date }}

## Summary

| Metric | Value |
|--------|-------|
| Total Orders | {{ $totalOrders }} |
| Total Items Sold | {{ $totalItemsSold }} |
| Total Revenue | ${{ number_format($totalRevenue, 2) }} |

@if($orders->count() > 0)
## Order Details

<x-mail::table>
| Order ID | Customer | Items | Total |
|----------|----------|-------|-------|
@foreach($orders as $order)
| #{{ $order->id }} | {{ $order->user->name }} | {{ $order->items->sum('quantity') }} | ${{ number_format($order->total_amount, 2) }} |
@endforeach
</x-mail::table>

## Products Sold

<x-mail::table>
| Product | Quantity | Revenue |
|---------|----------|---------|
@foreach($productsSold as $product)
| {{ $product['name'] }} | {{ $product['quantity'] }} | ${{ number_format($product['revenue'], 2) }} |
@endforeach
</x-mail::table>
@else
No orders were completed today.
@endif

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>


