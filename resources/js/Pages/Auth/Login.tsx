import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import LoadingSpinner from '@/Components/LoadingSpinner';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Login — TrustFactory" />

            <div className="card-brutal p-8">
                <div className="text-center mb-8">
                    <span className="font-mono text-xs text-orange-500 tracking-widest">WELCOME BACK</span>
                    <h1 className="text-3xl font-black text-white mt-2">LOGIN</h1>
                </div>

                {status && (
                    <div className="mb-6 p-4 bg-green-500/20 border border-green-500 text-green-400 font-mono text-sm">
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
                            autoComplete="username"
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && (
                            <p className="mt-2 font-mono text-xs text-red-400">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block font-mono text-xs text-neutral-400 tracking-wider mb-2">
                            PASSWORD
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="w-full bg-neutral-900 border-2 border-neutral-800 text-white px-4 py-3 font-mono text-sm focus:border-orange-500 focus:outline-none transition-colors"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        {errors.password && (
                            <p className="mt-2 font-mono text-xs text-red-400">{errors.password}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="w-4 h-4 bg-neutral-900 border-2 border-neutral-700 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
                            />
                            <span className="font-mono text-xs text-neutral-400">REMEMBER ME</span>
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="font-mono text-xs text-neutral-500 hover:text-orange-500 transition-colors"
                            >
                                FORGOT PASSWORD?
                            </Link>
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
                                LOGGING IN...
                            </>
                        ) : (
                            'LOGIN'
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
                    <span className="font-mono text-xs text-neutral-500">
                        DON'T HAVE AN ACCOUNT?{' '}
                        <Link href="/register" className="text-orange-500 hover:text-orange-400">
                            JOIN NOW
                        </Link>
                    </span>
                </div>
            </div>
        </GuestLayout>
    );
}
