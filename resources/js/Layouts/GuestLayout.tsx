import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function GuestLayout({ children }: PropsWithChildren) {
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
                                <Link href="/products" className="font-mono text-xs tracking-widest text-neutral-400 hover:text-white">
                                    PRODUCTS
                                </Link>
                                <Link href="/login" className="font-mono text-xs tracking-widest text-neutral-400 hover:text-white">
                                    LOGIN
                                </Link>
                                <Link href="/register" className="btn-primary px-5 py-2 text-xs">
                                    JOIN NOW
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="flex-1 flex items-center justify-center pt-20 pb-20 px-6">
                    <div className="w-full max-w-md">
                        {children}
                    </div>
                </main>

                <footer className="border-t border-neutral-800 py-8">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <span className="font-mono text-xs text-neutral-600 tracking-wider">
                            © {new Date().getFullYear()} TRUSTFACTORY — ALL RIGHTS RESERVED
                        </span>
                    </div>
                </footer>
            </div>
        </>
    );
}
