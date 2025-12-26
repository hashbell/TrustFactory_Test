import { Head, Link, router, usePage } from '@inertiajs/react';
import { PageProps, Product, PaginatedData } from '@/types';
import ShopLayout from '@/Layouts/ShopLayout';
import FlashMessage from '@/Components/FlashMessage';
import { useState } from 'react';

interface Props extends PageProps {
    products: PaginatedData<Product>;
}

export default function AdminProductsIndex() {
    const { products, shopConfig } = usePage<Props>().props;
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const lowStockThreshold = shopConfig.lowStockThreshold;

    const handleDelete = (product: Product) => {
        if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
            setDeletingId(product.id);
            router.delete(`/admin/products/${product.id}`, {
                onFinish: () => setDeletingId(null),
            });
        }
    };

    return (
        <ShopLayout>
            <Head title="Manage Products — Admin" />
            <FlashMessage />

            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
                    <div>
                        <span className="font-mono text-xs text-orange-500 tracking-widest">ADMIN PANEL</span>
                        <h1 className="text-4xl lg:text-5xl font-black text-white mt-2">MANAGE PRODUCTS</h1>
                        <p className="font-mono text-sm text-neutral-500 mt-2">{products.total} PRODUCTS</p>
                    </div>
                    <Link
                        href="/admin/products/create"
                        className="btn-primary px-6 py-3 text-sm inline-flex items-center gap-2"
                    >
                        <PlusIcon />
                        ADD PRODUCT
                    </Link>
                </div>

                {products.data.length === 0 ? (
                    <div className="card-brutal p-16 text-center">
                        <h2 className="text-2xl font-black text-white">NO PRODUCTS YET</h2>
                        <p className="mt-4 text-neutral-500">Start by adding your first product.</p>
                        <Link href="/admin/products/create" className="btn-primary px-8 py-4 mt-8 inline-block text-sm">
                            ADD FIRST PRODUCT
                        </Link>
                    </div>
                ) : (
                    <div className="card-brutal overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-neutral-800">
                                    <th className="text-left p-4 font-mono text-xs text-neutral-500 tracking-wider">PRODUCT</th>
                                    <th className="text-left p-4 font-mono text-xs text-neutral-500 tracking-wider">PRICE</th>
                                    <th className="text-left p-4 font-mono text-xs text-neutral-500 tracking-wider">STOCK</th>
                                    <th className="text-left p-4 font-mono text-xs text-neutral-500 tracking-wider">STATUS</th>
                                    <th className="text-right p-4 font-mono text-xs text-neutral-500 tracking-wider">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.data.map((product) => (
                                    <tr key={product.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-neutral-800 overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={product.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white">{product.name}</p>
                                                    <p className="font-mono text-xs text-neutral-500">ID: {product.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-bold text-gradient">${Number(product.price).toFixed(2)}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`font-mono text-sm ${product.stock_quantity <= lowStockThreshold ? 'text-red-400' : 'text-white'}`}>
                                                {product.stock_quantity} units
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {product.stock_quantity === 0 ? (
                                                <span className="tag-pill px-2 py-1 bg-red-500/20 border-red-500 text-red-400">
                                                    SOLD OUT
                                                </span>
                                            ) : product.stock_quantity <= lowStockThreshold ? (
                                                <span className="tag-pill px-2 py-1 bg-amber-500/20 border-amber-500 text-amber-400">
                                                    LOW STOCK
                                                </span>
                                            ) : (
                                                <span className="tag-pill px-2 py-1 bg-green-500/20 border-green-500 text-green-400">
                                                    IN STOCK
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/products/${product.id}`}
                                                    className="p-2 text-neutral-400 hover:text-white transition-colors"
                                                    title="View"
                                                >
                                                    <EyeIcon />
                                                </Link>
                                                <Link
                                                    href={`/admin/products/${product.id}/edit`}
                                                    className="p-2 text-neutral-400 hover:text-orange-500 transition-colors"
                                                    title="Edit"
                                                >
                                                    <EditIcon />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product)}
                                                    disabled={deletingId === product.id}
                                                    className="p-2 text-neutral-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                                    title="Delete"
                                                >
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {products.last_page > 1 && (
                            <div className="p-4 border-t border-neutral-800 flex items-center justify-between">
                                <span className="font-mono text-xs text-neutral-500">
                                    Page {products.current_page} of {products.last_page}
                                </span>
                                <div className="flex items-center gap-2">
                                    {products.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            preserveScroll
                                            className={`px-3 py-1.5 font-mono text-xs border transition-colors ${
                                                link.active
                                                    ? 'bg-orange-500 border-orange-500 text-black'
                                                    : link.url
                                                    ? 'border-neutral-700 text-neutral-400 hover:border-orange-500 hover:text-orange-500'
                                                    : 'border-neutral-800 text-neutral-700 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ShopLayout>
    );
}

// Icons
function PlusIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
    );
}

function EyeIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );
}

function EditIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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

