import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import LoadingSpinner from '@/Components/LoadingSpinner';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password — TrustFactory" />

            <div className="card-brutal p-8">
                <div className="text-center mb-8">
                    <span className="font-mono text-xs text-orange-500 tracking-widest">ACCOUNT RECOVERY</span>
                    <h1 className="text-3xl font-black text-white mt-2">RESET PASSWORD</h1>
                </div>

                <p className="mb-6 text-sm text-neutral-400 text-center">
                    Enter your email address and we'll send you a password reset link.
                </p>

                {status && (
                    <div className="mb-6 p-4 bg-green-500/20 border border-green-500 text-green-400 font-mono text-sm text-center">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block font-mono text-xs text-neutral-400 tracking-wider mb-2">
                            EMAIL ADDRESS
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full bg-neutral-900 border-2 border-neutral-800 text-white px-4 py-3 font-mono text-sm focus:border-orange-500 focus:outline-none transition-colors"
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && (
                            <p className="mt-2 font-mono text-xs text-red-400">{errors.email}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full btn-primary py-4 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {processing ? (
                            <>
                                <LoadingSpinner />
                                SENDING...
                            </>
                        ) : (
                            'SEND RESET LINK'
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
                    <Link href="/login" className="font-mono text-xs text-neutral-500 hover:text-orange-500">
                        ← BACK TO LOGIN
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
