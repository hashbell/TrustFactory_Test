import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }: PageProps) {
    const isAuthenticated = !!auth.user;

    return (
        <>
            <Head title="TrustFactory — Premium Goods" />

            <div className="noise-overlay" />

            <div className="min-h-screen bg-[#0a0a0a] grid-overlay">
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

                                {isAuthenticated ? (
                                    <>
                                        <Link href="/cart" className="font-mono text-xs tracking-widest text-neutral-400 hover:text-white">
                                            CART
                                        </Link>
                                        <Link href="/dashboard" className="font-mono text-xs tracking-widest text-neutral-400 hover:text-white">
                                            {auth.user?.name.toUpperCase()}
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

                <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center opacity-5">
                        <span className="text-[40vw] font-black text-white leading-none">TF</span>
                    </div>

                    <div className="relative z-10 text-center px-6 max-w-5xl">
                        <span className="inline-block font-mono text-xs text-orange-500 tracking-[0.3em] mb-8 animate-fade-in">
                            WELCOME TO THE FUTURE
                        </span>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] animate-fade-in" style={{ animationDelay: '100ms' }}>
                            PREMIUM GOODS
                            <br />
                            <span className="text-gradient">UNMATCHED QUALITY</span>
                        </h1>

                        <p className="mt-8 text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
                            Curated collection of exceptional products for those who demand nothing but the finest quality and craftsmanship.
                        </p>

                        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
                            <Link href="/products" className="btn-primary px-10 py-4 text-sm">
                                EXPLORE COLLECTION
                            </Link>
                            {!isAuthenticated && (
                                <Link href="/register" className="btn-secondary px-10 py-4 text-sm">
                                    CREATE ACCOUNT
                                </Link>
                            )}
                        </div>

                        <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '400ms' }}>
                            <div className="text-center">
                                <span className="block text-3xl md:text-4xl font-black text-gradient">500+</span>
                                <span className="font-mono text-xs text-neutral-500 tracking-wider">PRODUCTS</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-3xl md:text-4xl font-black text-gradient">10K+</span>
                                <span className="font-mono text-xs text-neutral-500 tracking-wider">CUSTOMERS</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-3xl md:text-4xl font-black text-gradient">99%</span>
                                <span className="font-mono text-xs text-neutral-500 tracking-wider">SATISFACTION</span>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-float">
                        <div className="flex flex-col items-center gap-2">
                            <span className="font-mono text-[10px] text-neutral-600 tracking-widest">SCROLL</span>
                            <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </div>
                    </div>
                </section>

                <section className="py-32 border-t border-neutral-800">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-20">
                            <span className="font-mono text-xs text-orange-500 tracking-widest">WHY CHOOSE US</span>
                            <h2 className="text-4xl md:text-5xl font-black text-white mt-4">
                                THE TRUSTFACTORY <span className="text-gradient">DIFFERENCE</span>
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<ShieldIcon />}
                                title="AUTHENTIC PRODUCTS"
                                description="Every item is verified for authenticity. No fakes, no compromises."
                            />
                            <FeatureCard
                                icon={<TruckIcon />}
                                title="FREE SHIPPING"
                                description="Complimentary worldwide shipping on all orders. No minimums."
                            />
                            <FeatureCard
                                icon={<SupportIcon />}
                                title="24/7 SUPPORT"
                                description="Our dedicated team is available around the clock to assist you."
                            />
                        </div>
                    </div>
                </section>

                <section className="py-32 border-t border-neutral-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10" />

                    <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-4xl md:text-6xl font-black text-white">
                            READY TO <span className="text-gradient">ELEVATE</span> YOUR STYLE?
                        </h2>
                        <p className="mt-6 text-lg text-neutral-400">
                            Join thousands of satisfied customers who trust us for their premium goods.
                        </p>
                        <Link href="/products" className="btn-primary px-12 py-5 text-sm mt-10 inline-block">
                            SHOP NOW
                        </Link>
                    </div>
                </section>

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

// Feature Card Component
function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="card-brutal p-8 text-center group">
            <div className="w-16 h-16 mx-auto border-2 border-neutral-800 flex items-center justify-center mb-6 group-hover:border-orange-500 transition-colors">
                {icon}
            </div>
            <h3 className="font-bold text-xl text-white mb-3">{title}</h3>
            <p className="text-neutral-500">{description}</p>
        </div>
    );
}

// Icons
function ShieldIcon() {
    return (
        <svg className="w-7 h-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
    );
}

function TruckIcon() {
    return (
        <svg className="w-7 h-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
    );
}

function SupportIcon() {
    return (
        <svg className="w-7 h-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
        </svg>
    );
}
