import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import LoadingSpinner from '@/Components/LoadingSpinner';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password — TrustFactory" />

            <div className="card-brutal p-8">
                <div className="text-center mb-8">
                    <span className="font-mono text-xs text-orange-500 tracking-widest">SECURITY CHECK</span>
                    <h1 className="text-3xl font-black text-white mt-2">CONFIRM PASSWORD</h1>
                </div>

                <p className="mb-6 text-sm text-neutral-400 text-center">
                    This is a secure area. Please confirm your password before continuing.
                </p>

                <form onSubmit={submit} className="space-y-6">
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
                            autoFocus
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        {errors.password && (
                            <p className="mt-2 font-mono text-xs text-red-400">{errors.password}</p>
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
                                CONFIRMING...
                            </>
                        ) : (
                            'CONFIRM'
                        )}
                    </button>
                </form>
            </div>
        </GuestLayout>
    );
}
