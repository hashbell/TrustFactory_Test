import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ReactNode } from 'react';
import AdminNotifications from '@/Components/AdminNotifications';

interface ShopLayoutProps {
    children: ReactNode;
    activeNav?: 'products' | 'cart' | 'orders' | 'dashboard' | 'admin';
}

export default function ShopLayout({ children, activeNav }: ShopLayoutProps) {
    const { auth } = usePage<PageProps>().props;
    const isAuthenticated = !!auth.user;
    const isAdmin = auth.user?.is_admin ?? false;
    const cartItemCount = (auth.user as any)?.cart?.item_count || 0;

    const navLinkClass = (name: string) =>
        `font-mono text-xs tracking-widest transition-colors ${
            activeNav === name ? 'text-orange-500' : 'text-neutral-400 hover:text-white'
        }`;

    return (
        <>
            <div className="noise-overlay" />

            <div className="min-h-screen bg-[#0a0a0a] grid-overlay flex flex-col">
                <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-neutral-800">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex items-center justify-between h-20">
                            <Link href="/" className="flex items-center gap-4 group">
                                <div className="relative">
                                    <div className="w-12 h-12 bg-orange-500 flex items-center justify-center">
                                        <span className="font-black text-xl text-black">TF</span>
                                    </div>
                                    <div className="absolute inset-0 border-2 border-orange-500 translate-x-1 translate-y-1 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform" />
                                </div>
                                <div>
                                    <span className="block font-black text-xl tracking-tight text-white">TRUSTFACTORY</span>
                                    <span className="block font-mono text-[10px] text-neutral-500 tracking-widest">PREMIUM GOODS</span>
                                </div>
                            </Link>

                            <div className="flex items-center gap-8">
                                <Link href="/products" className={navLinkClass('products')}>
                                    PRODUCTS
                                </Link>

                                {isAuthenticated ? (
                                    <>
                                        <Link href="/cart" className={`${navLinkClass('cart')} relative`}>
                                            CART
                                            {cartItemCount > 0 && (
                                                <span className="absolute -right-4 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-black">
                                                    {cartItemCount > 99 ? '99+' : cartItemCount}
                                                </span>
                                            )}
                                        </Link>
                                        <Link href="/orders" className={navLinkClass('orders')}>
                                            ORDERS
                                        </Link>
                                        <Link href="/dashboard" className={navLinkClass('dashboard')}>
                                            ACCOUNT
                                        </Link>
                                        {isAdmin && (
                                            <>
                                                <Link href="/admin/products" className={navLinkClass('admin')}>
                                                    MANAGE
                                                </Link>
                                                <AdminNotifications />
                                            </>
                                        )}
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="btn-secondary px-5 py-2 text-xs"
                                        >
                                            LOG OUT
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" className="font-mono text-xs tracking-widest text-neutral-400 hover:text-white">
                                            LOGIN
                                        </Link>
                                        <Link href="/register" className="btn-primary px-5 py-2 text-xs">
                                            JOIN NOW
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="flex-1 pt-32 pb-20">
                    {children}
                </main>

                <footer className="border-t border-neutral-800 py-12">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-orange-500 flex items-center justify-center">
                                    <span className="font-black text-lg text-black">TF</span>
                                </div>
                                <span className="font-mono text-xs text-neutral-500 tracking-wider">
                                    © {new Date().getFullYear()} TRUSTFACTORY
                                </span>
                            </div>
                            <div className="flex items-center gap-8">
                                <span className="font-mono text-[10px] text-neutral-600 tracking-wider">
                                    SECURE PAYMENTS
                                </span>
                                <span className="font-mono text-[10px] text-neutral-600 tracking-wider">
                                    FREE SHIPPING
                                </span>
                                <span className="font-mono text-[10px] text-neutral-600 tracking-wider">
                                    24/7 SUPPORT
                                </span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
