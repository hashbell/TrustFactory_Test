import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import ShopLayout from '@/Layouts/ShopLayout';
import FlashMessage from '@/Components/FlashMessage';

export default function Dashboard() {
    const { auth } = usePage<PageProps>().props;

    return (
        <ShopLayout activeNav="dashboard">
            <Head title="Dashboard — TrustFactory" />
            <FlashMessage />

            <div className="max-w-6xl mx-auto px-6">
                <div className="mb-12">
                    <span className="font-mono text-xs text-orange-500 tracking-widest">WELCOME BACK</span>
                    <h1 className="text-4xl lg:text-5xl font-black text-white mt-2">
                        {auth.user?.name.toUpperCase()}
                    </h1>
                    <p className="font-mono text-sm text-neutral-500 mt-2">{auth.user?.email}</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <QuickActionCard
                        href="/products"
                        icon={<ProductsIcon />}
                        title="BROWSE PRODUCTS"
                        description="Explore our premium collection"
                    />
                    <QuickActionCard
                        href="/cart"
                        icon={<CartIcon />}
                        title="VIEW CART"
                        description="Check your shopping cart"
                    />
                    <QuickActionCard
                        href="/orders"
                        icon={<OrdersIcon />}
                        title="ORDER HISTORY"
                        description="View your past purchases"
                    />
                </div>

                <div className="mt-16">
                    <h2 className="font-mono text-xs text-neutral-500 tracking-widest mb-6">
                        ACCOUNT SETTINGS
                    </h2>
                    <div className="card-brutal p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h3 className="font-bold text-xl text-white">Profile Information</h3>
                                <p className="text-neutral-500 mt-1">
                                    Manage your account details and preferences
                                </p>
                            </div>
                            <Link href="/profile" className="btn-secondary px-6 py-3 text-sm">
                                EDIT PROFILE
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}

interface QuickActionCardProps {
    href: string;
    icon: React.ReactNode;
    title: string;
    description: string;
}

function QuickActionCard({ href, icon, title, description }: QuickActionCardProps) {
    return (
        <Link href={href} className="card-brutal p-8 hover:border-orange-500/50 transition-colors group">
            <div className="w-14 h-14 border border-neutral-800 flex items-center justify-center mb-6 group-hover:border-orange-500/50 transition-colors">
                {icon}
            </div>
            <h3 className="font-bold text-lg text-white group-hover:text-orange-500 transition-colors">
                {title}
            </h3>
            <p className="text-sm text-neutral-500 mt-2">{description}</p>
        </Link>
    );
}

// Icons
function ProductsIcon() {
    return (
        <svg className="w-6 h-6 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    );
}

function CartIcon() {
    return (
        <svg className="w-6 h-6 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    );
}

function OrdersIcon() {
    return (
        <svg className="w-6 h-6 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );
}
