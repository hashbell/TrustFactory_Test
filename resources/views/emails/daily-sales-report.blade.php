<x-mail::message>
# Daily Sales Report

**Date:** {{ $date }}

## Summary

| Metric | Value |
|--------|-------|
| Total Orders | {{ $totalOrders }} |
| Total Items Sold | {{ $totalItemsSold }} |
| Total Revenue | ${{ number_format($totalRevenue, 2) }} |

@if($totalOrders > 0)
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
