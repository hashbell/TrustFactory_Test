import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { PageProps, Product } from '@/types';
import ShopLayout from '@/Layouts/ShopLayout';
import { FormEvent, useState, useRef } from 'react';

interface Props extends PageProps {
    product: Product;
}

export default function AdminProductsEdit() {
    const { product } = usePage<Props>().props;
    const isUploadedImage = product.image_url?.startsWith('/storage/');
    const [imageMode, setImageMode] = useState<'url' | 'file'>(isUploadedImage ? 'file' : 'url');
    const [previewUrl, setPreviewUrl] = useState<string>(isUploadedImage ? product.image_url || '' : '');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        description: string;
        price: string;
        stock_quantity: string;
        image_url: string;
        image: File | null;
        _method: string;
    }>({
        name: product.name,
        description: product.description || '',
        price: String(product.price),
        stock_quantity: String(product.stock_quantity),
        image_url: isUploadedImage ? '' : (product.image_url || ''),
        image: null,
        _method: 'PUT',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(`/admin/products/${product.id}`, {
            forceFormData: true,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setData('image_url', '');
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleModeChange = (mode: 'url' | 'file') => {
        setImageMode(mode);
        if (mode === 'url') {
            setData('image', null);
            setPreviewUrl('');
            if (fileInputRef.current) fileInputRef.current.value = '';
        } else {
            setData('image_url', '');
        }
    };

    return (
        <ShopLayout>
            <Head title={`Edit ${product.name} — Admin`} />

            <div className="max-w-3xl mx-auto px-6">
                <div className="mb-12">
                    <Link href="/admin/products" className="font-mono text-xs text-neutral-500 hover:text-orange-500 transition-colors">
                        ← BACK TO PRODUCTS
                    </Link>
                    <h1 className="text-4xl lg:text-5xl font-black text-white mt-4">EDIT PRODUCT</h1>
                    <p className="font-mono text-sm text-neutral-500 mt-2">ID: {product.id}</p>
                </div>

                <form onSubmit={handleSubmit} className="card-brutal p-8 space-y-6">
                    <div>
                        <label className="block font-mono text-xs text-neutral-400 tracking-wider mb-2">
                            PRODUCT NAME *
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full bg-neutral-900 border-2 border-neutral-700 px-4 py-3 text-white font-medium focus:border-orange-500 focus:outline-none transition-colors"
                            placeholder="Enter product name"
                        />
                        {errors.name && <p className="mt-2 text-red-400 text-sm">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block font-mono text-xs text-neutral-400 tracking-wider mb-2">
                            DESCRIPTION
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={4}
                            className="w-full bg-neutral-900 border-2 border-neutral-700 px-4 py-3 text-white font-medium focus:border-orange-500 focus:outline-none transition-colors resize-none"
                            placeholder="Enter product description"
                        />
                        {errors.description && <p className="mt-2 text-red-400 text-sm">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block font-mono text-xs text-neutral-400 tracking-wider mb-2">
                                PRICE ($) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                className="w-full bg-neutral-900 border-2 border-neutral-700 px-4 py-3 text-white font-medium focus:border-orange-500 focus:outline-none transition-colors"
                                placeholder="0.00"
                            />
                            {errors.price && <p className="mt-2 text-red-400 text-sm">{errors.price}</p>}
                        </div>
                        <div>
                            <label className="block font-mono text-xs text-neutral-400 tracking-wider mb-2">
                                STOCK QUANTITY *
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={data.stock_quantity}
                                onChange={(e) => setData('stock_quantity', e.target.value)}
                                className="w-full bg-neutral-900 border-2 border-neutral-700 px-4 py-3 text-white font-medium focus:border-orange-500 focus:outline-none transition-colors"
                                placeholder="0"
                            />
                            {errors.stock_quantity && <p className="mt-2 text-red-400 text-sm">{errors.stock_quantity}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block font-mono text-xs text-neutral-400 tracking-wider mb-2">
                            PRODUCT IMAGE
                        </label>
                        <div className="flex gap-2 mb-4">
                            <button
                                type="button"
                                onClick={() => handleModeChange('url')}
                                className={`px-4 py-2 font-mono text-xs border transition-colors ${
                                    imageMode === 'url'
                                        ? 'bg-orange-500 border-orange-500 text-black'
                                        : 'border-neutral-700 text-neutral-400 hover:border-orange-500'
                                }`}
                            >
                                URL
                            </button>
                            <button
                                type="button"
                                onClick={() => handleModeChange('file')}
                                className={`px-4 py-2 font-mono text-xs border transition-colors ${
                                    imageMode === 'file'
                                        ? 'bg-orange-500 border-orange-500 text-black'
                                        : 'border-neutral-700 text-neutral-400 hover:border-orange-500'
                                }`}
                            >
                                UPLOAD FILE
                            </button>
                        </div>

                        {imageMode === 'url' ? (
                            <div>
                                <input
                                    type="url"
                                    value={data.image_url}
                                    onChange={(e) => setData('image_url', e.target.value)}
                                    className="w-full bg-neutral-900 border-2 border-neutral-700 px-4 py-3 text-white font-medium focus:border-orange-500 focus:outline-none transition-colors"
                                    placeholder="https://example.com/image.jpg"
                                />
                                {errors.image_url && <p className="mt-2 text-red-400 text-sm">{errors.image_url}</p>}
                                <p className="mt-2 font-mono text-xs text-neutral-500">
                                    Tip: Use Unsplash URLs like https://images.unsplash.com/photo-xxx?w=400
                                </p>
                            </div>
                        ) : (
                            <div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-700 hover:border-orange-500 cursor-pointer transition-colors bg-neutral-900"
                                >
                                    <svg className="w-8 h-8 text-neutral-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-mono text-xs text-neutral-500">
                                        {data.image ? data.image.name : (previewUrl ? 'Click to change image' : 'Click to upload image')}
                                    </span>
                                </label>
                                {errors.image && <p className="mt-2 text-red-400 text-sm">{errors.image}</p>}
                            </div>
                        )}
                    </div>

                    {(data.image_url || previewUrl) && (
                        <div>
                            <label className="block font-mono text-xs text-neutral-400 tracking-wider mb-2">
                                IMAGE PREVIEW
                            </label>
                            <div className="w-32 h-32 bg-neutral-800 overflow-hidden">
                                <img
                                    src={previewUrl || data.image_url}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100';
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="btn-primary px-8 py-3 text-sm disabled:opacity-50"
                        >
                            {processing ? 'SAVING...' : 'SAVE CHANGES'}
                        </button>
                        <Link
                            href="/admin/products"
                            className="font-mono text-sm text-neutral-400 hover:text-white transition-colors"
                        >
                            CANCEL
                        </Link>
                    </div>
                </form>
            </div>
        </ShopLayout>
    );
}

