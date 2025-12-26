import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function UpdateProfileInformationForm({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const user = usePage().props.auth.user!;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section>
            <header className="mb-6">
                <h2 className="font-bold text-xl text-white">
                    Profile Information
                </h2>
                <p className="mt-1 text-sm text-neutral-400">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block font-mono text-xs text-neutral-400 tracking-wider mb-2">
                        NAME
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                        className="w-full bg-neutral-900 border-2 border-neutral-800 text-white px-4 py-3 font-mono text-sm focus:border-orange-500 focus:outline-none transition-colors"
                    />
                    {errors.name && (
                        <p className="mt-2 font-mono text-xs text-red-400">{errors.name}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block font-mono text-xs text-neutral-400 tracking-wider mb-2">
                        EMAIL
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                        className="w-full bg-neutral-900 border-2 border-neutral-800 text-white px-4 py-3 font-mono text-sm focus:border-orange-500 focus:outline-none transition-colors"
                    />
                    {errors.email && (
                        <p className="mt-2 font-mono text-xs text-red-400">{errors.email}</p>
                    )}
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-4 bg-amber-500/20 border border-amber-500">
                        <p className="text-sm text-amber-400">
                            Your email address is unverified.{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="underline hover:text-amber-300"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <p className="mt-2 text-sm font-medium text-green-400">
                                A new verification link has been sent to your email address.
                            </p>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="btn-primary px-6 py-3 text-sm disabled:opacity-50"
                    >
                        {processing ? 'SAVING...' : 'SAVE CHANGES'}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="font-mono text-sm text-green-400">SAVED</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
