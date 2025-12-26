<x-mail::message>
# Low Stock Alert

The following product is running low on stock:

**Product:** {{ $product->name }}
**Current Stock:** {{ $product->stock_quantity }} units
**Price:** ${{ number_format($product->price, 2) }}

Please restock this item as soon as possible to avoid potential lost sales.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>


