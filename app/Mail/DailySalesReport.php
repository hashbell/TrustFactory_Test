<?php

namespace App\Mail;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Bus\Queueable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection as SupportCollection;

class DailySalesReport extends Mailable
{
    use Queueable;
    use SerializesModels;

    /**
     * Create a new message instance.
     *
     * @param  Collection<int, Order>  $orders
     */
    public function __construct(
        public readonly Collection $orders
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Daily Sales Report - '.now()->format('F j, Y'),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.daily-sales-report',
            with: [
                'orders' => $this->orders,
                'totalRevenue' => $this->getTotalRevenue(),
                'totalOrders' => $this->getTotalOrders(),
                'totalItemsSold' => $this->getTotalItemsSold(),
                'productsSold' => $this->getProductsSold(),
                'date' => now()->format('F j, Y'),
            ],
        );
    }

    public function getTotalRevenue(): float
    {
        return $this->orders->sum('total_amount');
    }

    public function getTotalOrders(): int
    {
        return $this->orders->count();
    }

    public function getTotalItemsSold(): int
    {
        return $this->orders->flatMap(fn (Order $order) => $order->items)->sum('quantity');
    }

    /**
     * @return SupportCollection<int, array{id: int, name: string, quantity: int, revenue: float}>
     */
    public function getProductsSold(): SupportCollection
    {
        /** @var SupportCollection<int, OrderItem> $allItems */
        $allItems = $this->orders->flatMap(fn (Order $order) => $order->items);

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

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
