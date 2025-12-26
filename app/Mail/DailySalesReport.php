<?php

namespace App\Mail;

use App\DTOs\SalesReportData;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DailySalesReport extends Mailable
{
    use Queueable;
    use SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public readonly SalesReportData $reportData
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Daily Sales Report - '.$this->reportData->date,
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
                'totalRevenue' => $this->reportData->totalRevenue,
                'totalOrders' => $this->reportData->totalOrders,
                'totalItemsSold' => $this->reportData->totalItemsSold,
                'productsSold' => $this->reportData->productsSold,
                'date' => $this->reportData->date,
            ],
        );
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
