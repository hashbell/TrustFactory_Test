import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import LoadingSpinner from '@/Components/LoadingSpinner';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Join — TrustFactory" />

            <div className="card-brutal p-8">
                <div className="text-center mb-8">
                    <span className="font-mono text-xs text-orange-500 tracking-widest">CREATE ACCOUNT</span>
                    <h1 className="text-3xl font-black text-white mt-2">JOIN NOW</h1>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block font-mono text-xs text-neutral-400 tracking-wider mb-2">
                            FULL NAME
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            className="w-full bg-neutral-900 border-2 border-neutral-800 text-white px-4 py-3 font-mono text-sm focus:border-orange-500 focus:outline-none transition-colors"
                            autoComplete="name"
                            autoFocus
                            required
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && (
                            <p className="mt-2 font-mono text-xs text-red-400">{errors.name}</p>
                        )}
                    </div>

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
                            required
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
                            autoComplete="new-password"
                            required
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
                            required
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
                                CREATING ACCOUNT...
                            </>
                        ) : (
                            'CREATE ACCOUNT'
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
                    <span className="font-mono text-xs text-neutral-500">
                        ALREADY HAVE AN ACCOUNT?{' '}
                        <Link href="/login" className="text-orange-500 hover:text-orange-400">
                            LOGIN
                        </Link>
                    </span>
                </div>
            </div>
        </GuestLayout>
    );
}
