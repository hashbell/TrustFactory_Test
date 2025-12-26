import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import LoadingSpinner from '@/Components/LoadingSpinner';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verify Email — TrustFactory" />

            <div className="card-brutal p-8">
                <div className="text-center mb-8">
                    <span className="font-mono text-xs text-orange-500 tracking-widest">ALMOST THERE</span>
                    <h1 className="text-3xl font-black text-white mt-2">VERIFY EMAIL</h1>
                </div>

                <p className="mb-6 text-sm text-neutral-400 text-center">
                    Thanks for signing up! Before getting started, please verify your email address by clicking the link we just emailed to you.
                </p>

                {status === 'verification-link-sent' && (
                    <div className="mb-6 p-4 bg-green-500/20 border border-green-500 text-green-400 font-mono text-sm text-center">
                        A new verification link has been sent to your email address.
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
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
                            'RESEND VERIFICATION EMAIL'
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="font-mono text-xs text-neutral-500 hover:text-orange-500"
                    >
                        LOG OUT
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
