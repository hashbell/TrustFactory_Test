import { Head, Link, usePage, router } from '@inertiajs/react';
import { PageProps, Product, PaginatedData } from '@/types';
import ShopLayout from '@/Layouts/ShopLayout';
import ProductCard from '@/Components/ProductCard';
import FlashMessage from '@/Components/FlashMessage';

interface Props extends PageProps {
    products: PaginatedData<Product>;
    currentSort: string;
}

export default function ProductsIndex() {
    const { products, auth, currentSort } = usePage<Props>().props;
    const isAuthenticated = !!auth.user;

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.get('/products', { sort: e.target.value }, { preserveState: true, preserveScroll: true });
    };

    const getPaginationUrl = (url: string | null) => {
        if (!url) return '#';
        const urlObj = new URL(url, window.location.origin);
        if (currentSort && currentSort !== 'latest') {
            urlObj.searchParams.set('sort', currentSort);
        }
        return urlObj.pathname + urlObj.search;
    };

    return (
        <ShopLayout activeNav="products">
            <Head title="Products — TrustFactory" />
            <FlashMessage />

            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-16 text-center">
                    <span className="font-mono text-xs text-orange-500 tracking-widest">OUR COLLECTION</span>
                    <h1 className="text-4xl lg:text-6xl font-black text-white mt-2">
                        PREMIUM <span className="text-gradient">PRODUCTS</span>
                    </h1>
                    <p className="mt-4 text-neutral-500 max-w-2xl mx-auto">
                        Curated selection of premium goods for those who demand excellence.
                        Each product is hand-picked for quality and craftsmanship.
                    </p>
                </div>

                <div className="mb-12 flex items-center justify-between border-b border-neutral-800 pb-6">
                    <span className="font-mono text-xs text-neutral-500 tracking-wider">
                        SHOWING {products.data.length} OF {products.total} PRODUCTS
                    </span>
                    <div className="flex items-center gap-4">
                        <span className="font-mono text-xs text-neutral-600">SORT BY</span>
                        <select
                            value={currentSort}
                            onChange={handleSortChange}
                            className="bg-neutral-900 border border-neutral-800 px-4 py-2 font-mono text-xs text-white focus:border-orange-500 focus:outline-none cursor-pointer"
                        >
                            <option value="latest">LATEST</option>
                            <option value="price-asc">PRICE: LOW TO HIGH</option>
                            <option value="price-desc">PRICE: HIGH TO LOW</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.data.map((product, index) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            isAuthenticated={isAuthenticated}
                            index={index}
                        />
                    ))}
                </div>

                {products.data.length === 0 && (
                    <div className="card-brutal p-16 text-center">
                        <h2 className="text-2xl font-black text-white">NO PRODUCTS FOUND</h2>
                        <p className="mt-4 text-neutral-500">
                            Check back later for new arrivals.
                        </p>
                    </div>
                )}

                {products.last_page > 1 && (
                    <div className="mt-16 flex items-center justify-center gap-2">
                        {products.links.map((link, index) => (
                            <Link
                                key={index}
                                href={getPaginationUrl(link.url)}
                                preserveScroll
                                className={`px-4 py-2 font-mono text-xs border transition-colors ${
                                    link.active
                                        ? 'bg-orange-500 border-orange-500 text-black'
                                        : link.url
                                        ? 'border-neutral-800 text-neutral-400 hover:border-orange-500 hover:text-orange-500'
                                        : 'border-neutral-800 text-neutral-700 cursor-not-allowed'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </ShopLayout>
    );
}
