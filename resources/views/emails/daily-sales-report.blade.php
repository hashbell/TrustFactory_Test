<x-mail::message>
# Daily Sales Report

<x-mail::panel>
**Report Date:** {{ $date }}
</x-mail::panel>

---

## Today's Performance

<x-mail::table>
| Metric | Value |
|:-------|------:|
| **Total Orders** | {{ $totalOrders }} |
| **Items Sold** | {{ $totalItemsSold }} |
| **Revenue** | **${{ number_format($totalRevenue, 2) }}** |
</x-mail::table>

@if($totalOrders > 0)

---

## Products Sold Today

<x-mail::table>
| Product | Qty | Revenue |
|:--------|:---:|--------:|
@foreach($productsSold as $product)
| {{ $product['name'] }} | {{ $product['quantity'] }} | ${{ number_format($product['revenue'], 2) }} |
@endforeach
</x-mail::table>

@if($totalRevenue >= 1000)
<x-mail::panel>
**Great day!** Revenue exceeded $1,000!
</x-mail::panel>
@endif

@else

<x-mail::panel>
No orders were completed today. Tomorrow is a new opportunity!
</x-mail::panel>

@endif

---

<small>This is an automated report generated at {{ now()->format('g:i A') }} UTC.</small>

Thanks,<br>
**{{ config('app.name') }}**
</x-mail::message>
