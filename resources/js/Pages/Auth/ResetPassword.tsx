import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import LoadingSpinner from '@/Components/LoadingSpinner';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password — TrustFactory" />

            <div className="card-brutal p-8">
                <div className="text-center mb-8">
                    <span className="font-mono text-xs text-orange-500 tracking-widest">ACCOUNT RECOVERY</span>
                    <h1 className="text-3xl font-black text-white mt-2">NEW PASSWORD</h1>
                </div>

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
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && (
                            <p className="mt-2 font-mono text-xs text-red-400">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block font-mono text-xs text-neutral-400 tracking-wider mb-2">
                            NEW PASSWORD
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="w-full bg-neutral-900 border-2 border-neutral-800 text-white px-4 py-3 font-mono text-sm focus:border-orange-500 focus:outline-none transition-colors"
                            autoComplete="new-password"
                            autoFocus
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        {errors.password && (
                            <p className="mt-2 font-mono text-xs text-red-400">{errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password_confirmation" className="block font-mono text-xs text-neutral-400 tracking-wider mb-2">
                            CONFIRM PASSWORD
                        </label>
                        <input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="w-full bg-neutral-900 border-2 border-neutral-800 text-white px-4 py-3 font-mono text-sm focus:border-orange-500 focus:outline-none transition-colors"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                        />
                        {errors.password_confirmation && (
                            <p className="mt-2 font-mono text-xs text-red-400">{errors.password_confirmation}</p>
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
                                RESETTING...
                            </>
                        ) : (
                            'RESET PASSWORD'
                        )}
                    </button>
                </form>
            </div>
        </GuestLayout>
    );
}
