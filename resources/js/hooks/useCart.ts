import { router } from '@inertiajs/react';
import { useState, useCallback } from 'react';

interface UseCartOptions {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export function useCart(options: UseCartOptions = {}) {
    const [processingItems, setProcessingItems] = useState<Set<number>>(new Set());
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

    const isProcessing = useCallback(
        (productId: number) => processingItems.has(productId),
        [processingItems]
    );

    const addToCart = useCallback(
        (productId: number, quantity: number = 1) => {
            setProcessingItems((prev) => new Set(prev).add(productId));

            router.post(
                '/cart',
                { product_id: productId, quantity },
                {
                    preserveScroll: true,
                    onSuccess: () => options.onSuccess?.(),
                    onError: () => options.onError?.('Failed to add item to cart'),
                    onFinish: () => {
                        setProcessingItems((prev) => {
                            const next = new Set(prev);
                            next.delete(productId);
                            return next;
                        });
                    },
                }
            );
        },
        [options]
    );

    const updateQuantity = useCallback(
        (productId: number, quantity: number) => {
            if (quantity < 1) {
                removeItem(productId);
                return;
            }

            setProcessingItems((prev) => new Set(prev).add(productId));

            router.patch(
                `/cart/${productId}`,
                { quantity },
                {
                    preserveScroll: true,
                    onSuccess: () => options.onSuccess?.(),
                    onError: () => options.onError?.('Failed to update quantity'),
                    onFinish: () => {
                        setProcessingItems((prev) => {
                            const next = new Set(prev);
                            next.delete(productId);
                            return next;
                        });
                    },
                }
            );
        },
        [options]
    );

    const removeItem = useCallback(
        (productId: number) => {
            setProcessingItems((prev) => new Set(prev).add(productId));

            router.delete(`/cart/${productId}`, {
                preserveScroll: true,
                onSuccess: () => options.onSuccess?.(),
                onError: () => options.onError?.('Failed to remove item'),
                onFinish: () => {
                    setProcessingItems((prev) => {
                        const next = new Set(prev);
                        next.delete(productId);
                        return next;
                    });
                },
            });
        },
        [options]
    );

    const clearCart = useCallback(() => {
        if (!confirm('Clear all items from your cart?')) return;

        setIsClearing(true);
        router.post(
            '/cart/clear',
            {},
            {
                onSuccess: () => options.onSuccess?.(),
                onError: () => options.onError?.('Failed to clear cart'),
                onFinish: () => setIsClearing(false),
            }
        );
    }, [options]);

    const checkout = useCallback(() => {
        setIsCheckingOut(true);
        router.post(
            '/checkout',
            {},
            {
                onSuccess: () => options.onSuccess?.(),
                onError: () => options.onError?.('Checkout failed'),
                onFinish: () => setIsCheckingOut(false),
            }
        );
    }, [options]);

    return {
        // State
        processingItems,
        isCheckingOut,
        isClearing,

        // Helpers
        isProcessing,

        // Actions
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        checkout,
    };
}

