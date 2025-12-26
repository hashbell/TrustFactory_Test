<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property-read Collection<int, CartItem> $items
 */
class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function getTotalAttribute(): float
    {
        return $this->items->sum(function (CartItem $item) {
            return $item->quantity * $item->product->price;
        });
    }

    public function getItemCountAttribute(): int
    {
        return $this->items->sum('quantity');
    }

    public function isEmpty(): bool
    {
        return $this->items->isEmpty();
    }
}
