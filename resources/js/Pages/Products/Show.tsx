import { Head, Link, router, usePage } from '@inertiajs/react';
import { PageProps, Product } from '@/types';
import ShopLayout from '@/Layouts/ShopLayout';
import FlashMessage from '@/Components/FlashMessage';
import LoadingSpinner from '@/Components/LoadingSpinner';
import { useCart } from '@/hooks';
import { useState } from 'react';

interface Props extends PageProps {
    product: Product;
}

export default function ProductShow() {
    const { product, auth, shopConfig } = usePage<Props>().props;
    const isAuthenticated = !!auth.user;
    const { addToCart, isProcessing } = useCart();

    const [quantity, setQuantity] = useState(1);
    const isAdding = isProcessing(product.id);

    const isOutOfStock = product.stock_quantity === 0;
    const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= shopConfig.lowStockThreshold;

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            router.visit('/login');
            return;
        }
        addToCart(product.id, quantity);
    };

    const incrementQuantity = () => {
        if (quantity < product.stock_quantity) {
            setQuantity((prev) => prev + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    return (
        <ShopLayout activeNav="products">
            <Head title={`${product.name} — TrustFactory`} />
            <FlashMessage />

            <div className="max-w-7xl mx-auto px-6">

                <nav className="mb-8 flex items-center gap-2 font-mono text-xs text-neutral-500">
                    <Link href="/products" className="hover:text-orange-500">
                        PRODUCTS
                    </Link>
                    <span className="text-neutral-700">/</span>
                    <span className="text-orange-500">{product.name.toUpperCase()}</span>
                </nav>

                <div className="grid lg:grid-cols-2 gap-16">
                    <div className="relative">
                        <div className="card-brutal overflow-hidden aspect-square">
                            <img
                                src={product.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />

                            {isOutOfStock && (
                                <div className="absolute left-6 top-6 tag-pill px-4 py-2 bg-red-500/20 border-red-500 text-red-400">
                                    SOLD OUT
                                </div>
                            )}
                            {isLowStock && (
                                <div className="absolute left-6 top-6 tag-pill px-4 py-2">
                                    ONLY {product.stock_quantity} LEFT
                                </div>
                            )}
                        </div>

                        <div className="absolute -inset-4 border border-neutral-800 -z-10" />
                        <div className="absolute -inset-8 border border-neutral-900 -z-20" />
                    </div>

                    <div className="flex flex-col">
                        <span className="font-mono text-xs text-neutral-500">
                            #{String(product.id).padStart(3, '0')} — PREMIUM COLLECTION
                        </span>

                        <h1 className="mt-4 text-4xl lg:text-5xl font-black text-white leading-tight">
                            {product.name}
                        </h1>

                        <div className="mt-6 flex items-baseline gap-4">
                            <span className="text-4xl font-black text-gradient">
                                ${Number(product.price).toFixed(2)}
                            </span>
                            <span
                                className={`tag-pill px-3 py-1 ${
                                    isOutOfStock
                                        ? 'bg-red-500/20 border-red-500 text-red-400'
                                        : isLowStock
                                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                                        : 'bg-green-500/20 border-green-500 text-green-400'
                                }`}
                            >
                                {isOutOfStock ? 'OUT OF STOCK' : `${product.stock_quantity} IN STOCK`}
                            </span>
                        </div>

                        <p className="mt-8 text-neutral-400 leading-relaxed">
                            {product.description ||
                                'Premium quality product crafted with exceptional attention to detail. Each piece represents our commitment to excellence and superior craftsmanship.'}
                        </p>

                        <div className="mt-12 flex flex-col gap-6">
                            <div className="flex items-center gap-6">
                                <span className="font-mono text-xs text-neutral-500 tracking-wider">
                                    QUANTITY
                                </span>
                                <div className="flex items-center border-2 border-neutral-800">
                                    <button
                                        onClick={decrementQuantity}
                                        disabled={quantity <= 1 || isOutOfStock}
                                        className="w-12 h-12 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-50 transition-colors"
                                    >
                                        −
                                    </button>
                                    <span className="w-16 text-center font-mono font-bold text-white text-lg">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={incrementQuantity}
                                        disabled={quantity >= product.stock_quantity || isOutOfStock}
                                        className="w-12 h-12 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-50 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding || isOutOfStock}
                                className="btn-primary py-5 text-sm flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isAdding ? (
                                    <>
                                        <LoadingSpinner className="h-5 w-5" />
                                        ADDING TO CART...
                                    </>
                                ) : isOutOfStock ? (
                                    'OUT OF STOCK'
                                ) : (
                                    <>
                                        <CartIcon />
                                        ADD TO CART — ${(Number(product.price) * quantity).toFixed(2)}
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="mt-12 pt-8 border-t border-neutral-800 grid grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="w-12 h-12 mx-auto border border-neutral-800 flex items-center justify-center mb-3">
                                    <TruckIcon />
                                </div>
                                <span className="font-mono text-[10px] text-neutral-500 tracking-wider">
                                    FREE SHIPPING
                                </span>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 mx-auto border border-neutral-800 flex items-center justify-center mb-3">
                                    <ShieldIcon />
                                </div>
                                <span className="font-mono text-[10px] text-neutral-500 tracking-wider">
                                    2 YEAR WARRANTY
                                </span>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 mx-auto border border-neutral-800 flex items-center justify-center mb-3">
                                    <ReturnIcon />
                                </div>
                                <span className="font-mono text-[10px] text-neutral-500 tracking-wider">
                                    30 DAY RETURNS
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}

// Icon Components
function CartIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    );
}

function TruckIcon() {
    return (
        <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
    );
}

function ShieldIcon() {
    return (
        <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
    );
}

function ReturnIcon() {
    return (
        <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
        </svg>
    );
}
