import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps, Order } from '@/types';
import ShopLayout from '@/Layouts/ShopLayout';
import FlashMessage from '@/Components/FlashMessage';

interface Props extends PageProps {
    orders: Order[];
}

export default function OrdersIndex() {
    const { orders } = usePage<Props>().props;

    return (
        <ShopLayout activeNav="orders">
            <Head title="Orders — TrustFactory" />
            <FlashMessage />

            <div className="max-w-6xl mx-auto px-6">
                <div className="mb-12">
                    <span className="font-mono text-xs text-orange-500 tracking-widest">PURCHASE HISTORY</span>
                    <h1 className="text-4xl lg:text-5xl font-black text-white mt-2">MY ORDERS</h1>
                    <p className="font-mono text-sm text-neutral-500 mt-2">{orders.length} ORDERS</p>
                </div>

                {orders.length === 0 ? (
                    <EmptyOrders />
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <OrderRow key={order.id} order={order} />
                        ))}
                    </div>
                )}
            </div>
        </ShopLayout>
    );
}

interface OrderRowProps {
    order: Order;
}

function OrderRow({ order }: OrderRowProps) {
    const statusColors: Record<string, string> = {
        pending: 'bg-amber-500/20 border-amber-500 text-amber-400',
        processing: 'bg-blue-500/20 border-blue-500 text-blue-400',
        completed: 'bg-green-500/20 border-green-500 text-green-400',
        cancelled: 'bg-red-500/20 border-red-500 text-red-400',
    };

    const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <Link
            href={`/orders/${order.id}`}
            className="block card-brutal p-6 hover:border-orange-500/50 transition-colors"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                    <div className="flex -space-x-4">
                        {order.items.slice(0, 3).map((item, index) => (
                            <div
                                key={item.id}
                                className="w-14 h-14 border-2 border-neutral-900 bg-neutral-800 overflow-hidden"
                                style={{ zIndex: 3 - index }}
                            >
                                <img
                                    src={item.product.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'}
                                    alt={item.product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                        {order.items.length > 3 && (
                            <div className="w-14 h-14 border-2 border-neutral-900 bg-neutral-800 flex items-center justify-center">
                                <span className="font-mono text-xs text-neutral-400">
                                    +{order.items.length - 3}
                                </span>
                            </div>
                        )}
                    </div>

                    <div>
                        <span className="font-mono text-[10px] text-neutral-500">
                            ORDER #{String(order.id).padStart(5, '0')}
                        </span>
                        <p className="font-bold text-white mt-1">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </p>
                        <span className="font-mono text-xs text-neutral-500">{formattedDate}</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <span className={`tag-pill px-3 py-1 ${statusColors[order.status] || statusColors.pending}`}>
                        {order.status.toUpperCase()}
                    </span>
                    <span className="text-xl font-black text-gradient">
                        ${Number(order.total_amount).toFixed(2)}
                    </span>
                    <ChevronRightIcon />
                </div>
            </div>
        </Link>
    );
}

function EmptyOrders() {
    return (
        <div className="card-brutal p-16 text-center">
            <div className="w-24 h-24 mx-auto mb-8 border-2 border-neutral-800 flex items-center justify-center">
                <PackageIcon />
            </div>
            <h2 className="text-2xl font-black text-white">NO ORDERS YET</h2>
            <p className="mt-4 text-neutral-500 max-w-md mx-auto">
                You haven't placed any orders yet. Start shopping to see your order history here.
            </p>
            <Link href="/products" className="btn-primary px-8 py-4 mt-8 inline-block text-sm">
                START SHOPPING
            </Link>
        </div>
    );
}

// Icons
function ChevronRightIcon() {
    return (
        <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    );
}

function PackageIcon() {
    return (
        <svg className="w-12 h-12 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    );
}
