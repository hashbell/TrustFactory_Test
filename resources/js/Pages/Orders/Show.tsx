import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps, Order } from '@/types';
import ShopLayout from '@/Layouts/ShopLayout';
import FlashMessage from '@/Components/FlashMessage';

interface Props extends PageProps {
    order: Order;
}

export default function OrderShow() {
    const { order } = usePage<Props>().props;

    const statusColors: Record<string, string> = {
        pending: 'bg-amber-500/20 border-amber-500 text-amber-400',
        processing: 'bg-blue-500/20 border-blue-500 text-blue-400',
        completed: 'bg-green-500/20 border-green-500 text-green-400',
        cancelled: 'bg-red-500/20 border-red-500 text-red-400',
    };

    const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <ShopLayout activeNav="orders">
            <Head title={`Order #${order.id} — TrustFactory`} />
            <FlashMessage />

            <div className="max-w-6xl mx-auto px-6">
                <nav className="mb-8 flex items-center gap-2 font-mono text-xs text-neutral-500">
                    <Link href="/orders" className="hover:text-orange-500 flex items-center gap-1">
                        <ChevronLeftIcon /> ORDERS
                    </Link>
                    <span className="text-neutral-700">/</span>
                    <span className="text-orange-500">#{String(order.id).padStart(5, '0')}</span>
                </nav>

                <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <span className="font-mono text-xs text-neutral-500 tracking-widest">ORDER DETAILS</span>
                        <h1 className="text-4xl lg:text-5xl font-black text-white mt-2">
                            ORDER #{String(order.id).padStart(5, '0')}
                        </h1>
                        <p className="font-mono text-sm text-neutral-500 mt-2">{formattedDate}</p>
                    </div>
                    <span className={`tag-pill px-4 py-2 text-sm ${statusColors[order.status] || statusColors.pending}`}>
                        {order.status.toUpperCase()}
                    </span>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="font-mono text-xs text-neutral-500 tracking-widest mb-4">
                            ITEMS ({order.items.length})
                        </h2>

                        {order.items.map((item) => (
                            <div key={item.id} className="card-brutal p-6">
                                <div className="flex gap-6">
                                    <Link
                                        href={`/products/${item.product_id}`}
                                        className="w-24 h-24 flex-shrink-0 overflow-hidden bg-neutral-900"
                                    >
                                        <img
                                            src={item.product.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover hover:scale-110 transition-transform"
                                        />
                                    </Link>

                                    <div className="flex-1 flex items-center justify-between">
                                        <div>
                                            <span className="font-mono text-[10px] text-neutral-500">
                                                #{String(item.product_id).padStart(3, '0')}
                                            </span>
                                            <Link
                                                href={`/products/${item.product_id}`}
                                                className="block font-bold text-lg text-white hover:text-orange-500"
                                            >
                                                {item.product.name}
                                            </Link>
                                            <span className="font-mono text-sm text-neutral-500">
                                                ${Number(item.price).toFixed(2)} × {item.quantity}
                                            </span>
                                        </div>
                                        <span className="text-xl font-black text-gradient">
                                            ${Number(item.subtotal).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="card-brutal p-8 sticky top-28">
                            <h2 className="font-black text-xl text-white mb-6">ORDER SUMMARY</h2>

                            <div className="space-y-4 pb-6 border-b border-neutral-800">
                                <div className="flex justify-between font-mono text-sm">
                                    <span className="text-neutral-500">SUBTOTAL</span>
                                    <span className="text-white">${Number(order.total_amount).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-mono text-sm">
                                    <span className="text-neutral-500">SHIPPING</span>
                                    <span className="text-green-500">FREE</span>
                                </div>
                                <div className="flex justify-between font-mono text-sm">
                                    <span className="text-neutral-500">STATUS</span>
                                    <span className={order.status === 'completed' ? 'text-green-400' : 'text-amber-400'}>
                                        {order.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div className="py-6">
                                <div className="flex justify-between items-baseline">
                                    <span className="font-mono text-sm text-neutral-500">TOTAL PAID</span>
                                    <span className="text-3xl font-black text-gradient">
                                        ${Number(order.total_amount).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <Link
                                href="/products"
                                className="w-full btn-primary py-4 text-sm flex items-center justify-center gap-2"
                            >
                                CONTINUE SHOPPING
                            </Link>

                            <Link
                                href="/orders"
                                className="w-full btn-secondary py-4 text-sm flex items-center justify-center gap-2 mt-3"
                            >
                                VIEW ALL ORDERS
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}

function ChevronLeftIcon() {
    return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
    );
}
