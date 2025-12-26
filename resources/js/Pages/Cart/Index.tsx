import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps, Cart, CartItem } from '@/types';
import ShopLayout from '@/Layouts/ShopLayout';
import FlashMessage from '@/Components/FlashMessage';
import LoadingSpinner from '@/Components/LoadingSpinner';
import { useCart } from '@/hooks';

interface Props extends PageProps {
    cart: Cart;
    cartItems: CartItem[];
    total: number;
    itemCount: number;
}

export default function CartIndex() {
    const { cartItems, total, itemCount } = usePage<Props>().props;
    const {
        updateQuantity,
        removeItem,
        clearCart,
        checkout,
        isProcessing,
        isCheckingOut,
        isClearing,
    } = useCart();

    const isEmpty = cartItems.length === 0;

    return (
        <ShopLayout activeNav="cart">
            <Head title="Cart — TrustFactory" />
            <FlashMessage />

            <div className="max-w-6xl mx-auto px-6">
                <div className="mb-12">
                    <span className="font-mono text-xs text-orange-500 tracking-widest">YOUR SELECTION</span>
                    <h1 className="text-4xl lg:text-5xl font-black text-white mt-2">SHOPPING CART</h1>
                    <p className="font-mono text-sm text-neutral-500 mt-2">{itemCount} ITEMS</p>
                </div>

                {isEmpty ? (
                    <EmptyCart />
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <CartItemRow
                                    key={item.id}
                                    item={item}
                                    isProcessing={isProcessing(item.product_id)}
                                    onUpdateQuantity={(qty) => updateQuantity(item.product_id, qty)}
                                    onRemove={() => removeItem(item.product_id)}
                                />
                            ))}

                            <div className="flex justify-between items-center pt-4">
                                <Link
                                    href="/products"
                                    className="font-mono text-xs text-neutral-500 hover:text-orange-500 tracking-wider flex items-center gap-2"
                                >
                                    <ChevronLeftIcon />
                                    CONTINUE SHOPPING
                                </Link>
                                <button
                                    onClick={clearCart}
                                    disabled={isClearing}
                                    className="font-mono text-xs text-red-500 hover:text-red-400 tracking-wider disabled:opacity-50"
                                >
                                    {isClearing ? 'CLEARING...' : 'CLEAR CART'}
                                </button>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <OrderSummary
                                itemCount={itemCount}
                                total={total}
                                isCheckingOut={isCheckingOut}
                                onCheckout={checkout}
                            />
                        </div>
                    </div>
                )}
            </div>
        </ShopLayout>
    );
}

// Sub-components for better organization
interface CartItemRowProps {
    item: CartItem;
    isProcessing: boolean;
    onUpdateQuantity: (quantity: number) => void;
    onRemove: () => void;
}

function CartItemRow({ item, isProcessing, onUpdateQuantity, onRemove }: CartItemRowProps) {
    return (
        <div className={`card-brutal p-6 transition-opacity ${isProcessing ? 'opacity-50' : ''}`}>
            <div className="flex gap-6">
                <Link
                    href={`/products/${item.product_id}`}
                    className="w-28 h-28 flex-shrink-0 overflow-hidden bg-neutral-900"
                >
                    <img
                        src={item.product.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                        alt={item.product.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform"
                    />
                </Link>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <span className="font-mono text-[10px] text-neutral-500">
                                #{String(item.product_id).padStart(3, '0')}
                            </span>
                            <Link
                                href={`/products/${item.product_id}`}
                                className="block font-bold text-lg text-white hover:text-orange-500 line-clamp-1"
                            >
                                {item.product.name}
                            </Link>
                            <span className="font-mono text-sm text-orange-500">
                                ${Number(item.product.price).toFixed(2)} each
                            </span>
                        </div>
                        <button
                            onClick={onRemove}
                            disabled={isProcessing}
                            className="p-2 text-neutral-500 hover:text-red-500 hover:bg-neutral-800 transition-colors disabled:opacity-50"
                        >
                            <TrashIcon />
                        </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center border-2 border-neutral-800">
                            <button
                                onClick={() => onUpdateQuantity(item.quantity - 1)}
                                disabled={item.quantity <= 1 || isProcessing}
                                className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-50"
                            >
                                −
                            </button>
                            <span className="w-12 text-center font-mono font-bold text-white">
                                {item.quantity}
                            </span>
                            <button
                                onClick={() => onUpdateQuantity(item.quantity + 1)}
                                disabled={item.quantity >= item.product.stock_quantity || isProcessing}
                                className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-50"
                            >
                                +
                            </button>
                        </div>
                        <span className="text-xl font-black text-gradient">
                            ${(item.quantity * Number(item.product.price)).toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface OrderSummaryProps {
    itemCount: number;
    total: number;
    isCheckingOut: boolean;
    onCheckout: () => void;
}

function OrderSummary({ itemCount, total, isCheckingOut, onCheckout }: OrderSummaryProps) {
    return (
        <div className="card-brutal p-8 sticky top-28">
            <h2 className="font-black text-xl text-white mb-6">ORDER SUMMARY</h2>

            <div className="space-y-4 pb-6 border-b border-neutral-800">
                <div className="flex justify-between font-mono text-sm">
                    <span className="text-neutral-500">SUBTOTAL ({itemCount})</span>
                    <span className="text-white">${Number(total).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-mono text-sm">
                    <span className="text-neutral-500">SHIPPING</span>
                    <span className="text-green-500">FREE</span>
                </div>
            </div>

            <div className="py-6">
                <div className="flex justify-between items-baseline">
                    <span className="font-mono text-sm text-neutral-500">TOTAL</span>
                    <span className="text-3xl font-black text-gradient">${Number(total).toFixed(2)}</span>
                </div>
            </div>

            <button
                onClick={onCheckout}
                disabled={isCheckingOut}
                className="w-full btn-primary py-5 text-sm flex items-center justify-center gap-3 disabled:opacity-50"
            >
                {isCheckingOut ? (
                    <>
                        <LoadingSpinner className="h-5 w-5" />
                        PROCESSING...
                    </>
                ) : (
                    'CHECKOUT NOW'
                )}
            </button>

            <p className="mt-6 text-center font-mono text-[10px] text-neutral-600 tracking-wider">
                SECURE CHECKOUT • SSL ENCRYPTED
            </p>
        </div>
    );
}

function EmptyCart() {
    return (
        <div className="card-brutal p-16 text-center">
            <div className="w-24 h-24 mx-auto mb-8 border-2 border-neutral-800 flex items-center justify-center">
                <CartIcon />
            </div>
            <h2 className="text-2xl font-black text-white">YOUR CART IS EMPTY</h2>
            <p className="mt-4 text-neutral-500 max-w-md mx-auto">
                Looks like you haven't added anything to your cart yet. Start exploring our premium collection.
            </p>
            <Link href="/products" className="btn-primary px-8 py-4 mt-8 inline-block text-sm">
                EXPLORE PRODUCTS
            </Link>
        </div>
    );
}

// Icon Components
function CartIcon() {
    return (
        <svg className="w-12 h-12 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    );
}

function TrashIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    );
}

function ChevronLeftIcon() {
    return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
    );
}
