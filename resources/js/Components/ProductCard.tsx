import { Link, router, usePage } from '@inertiajs/react';
import { PageProps, Product } from '@/types';
import { useCart } from '@/hooks';
import LoadingSpinner from '@/Components/LoadingSpinner';

interface ProductCardProps {
    product: Product;
    isAuthenticated: boolean;
    index?: number;
}

export default function ProductCard({ product, isAuthenticated, index = 0 }: ProductCardProps) {
    const { shopConfig } = usePage<PageProps>().props;
    const { addToCart, isProcessing } = useCart();
    const isAdding = isProcessing(product.id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            router.visit('/login');
            return;
        }
        addToCart(product.id, 1);
    };

    const isOutOfStock = product.stock_quantity === 0;
    const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= shopConfig.lowStockThreshold;

    return (
        <div
            className="group relative animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Card */}
            <div className="card-brutal overflow-hidden">
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
                    <img
                        src={product.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'}
                        alt={product.name}
                        className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
                    />

                    {/* Diagonal Price Tag */}
                    <div className="absolute -right-12 top-6 w-40 rotate-45 bg-orange-500 py-1 text-center">
                        <span className="font-mono text-sm font-bold text-black">
                            ${Number(product.price).toFixed(0)}
                        </span>
                    </div>

                    {/* Stock Badge */}
                    {isOutOfStock && (
                        <div className="absolute left-4 top-4 tag-pill px-3 py-1 bg-red-500/20 border-red-500 text-red-400">
                            Sold Out
                        </div>
                    )}
                    {isLowStock && (
                        <div className="absolute left-4 top-4 tag-pill px-3 py-1">
                            {product.stock_quantity} Left
                        </div>
                    )}

                    {/* Hover Actions */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex flex-col gap-3">
                            <Link
                                href={`/products/${product.id}`}
                                className="btn-secondary px-6 py-3 text-center text-sm"
                            >
                                View Details
                            </Link>
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding || isOutOfStock}
                                className="btn-primary px-6 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isAdding ? (
                                    <span className="flex items-center gap-2 justify-center">
                                        <LoadingSpinner />
                                        Adding...
                                    </span>
                                ) : isOutOfStock ? (
                                    'Sold Out'
                                ) : (
                                    '+ Add to Cart'
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 relative">
                    {/* Product Number */}
                    <span className="absolute -top-3 right-4 font-mono text-xs text-neutral-600">
                        #{String(product.id).padStart(3, '0')}
                    </span>

                    <Link href={`/products/${product.id}`}>
                        <h3 className="font-bold text-lg text-white group-hover:text-orange-500 transition-colors line-clamp-1">
                            {product.name}
                        </h3>
                    </Link>

                    <p className="mt-2 text-sm text-neutral-500 line-clamp-2 leading-relaxed">
                        {product.description || 'Premium quality product with exceptional craftsmanship.'}
                    </p>

                    {/* Footer */}
                    <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center justify-between">
                        <span className="text-2xl font-black text-gradient">
                            ${Number(product.price).toFixed(2)}
                        </span>
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-2 h-2 rounded-full ${
                                    isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-amber-500' : 'bg-green-500'
                                }`}
                            />
                            <span className="font-mono text-xs text-neutral-500">
                                {product.stock_quantity} units
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
