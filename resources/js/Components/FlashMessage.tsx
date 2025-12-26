import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function FlashMessage() {
    const { flash } = usePage<PageProps>().props;
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setMessage({ type: 'success', text: flash.success });
            setShow(true);
        } else if (flash?.error) {
            setMessage({ type: 'error', text: flash.error });
            setShow(true);
        }

        const timer = setTimeout(() => setShow(false), 4000);
        return () => clearTimeout(timer);
    }, [flash]);

    if (!show || !message) return null;

    return (
        <div className="fixed top-24 right-6 z-50 animate-slide-in">
            <div
                className={`relative flex items-center gap-4 px-6 py-4 border-2 ${
                    message.type === 'success'
                        ? 'bg-[#0a0a0a] border-green-500 text-green-500'
                        : 'bg-[#0a0a0a] border-red-500 text-red-500'
                }`}
            >
                <div className={`absolute -top-1 -left-1 w-3 h-3 ${
                    message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`} />

                {message.type === 'success' ? (
                    <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
                <span className="font-mono text-sm tracking-wide">{message.text.toUpperCase()}</span>
                <button
                    onClick={() => setShow(false)}
                    className="ml-2 hover:opacity-70 transition-opacity"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
