import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

export default function UpdatePasswordForm() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section>
            <header className="mb-6">
                <h2 className="font-bold text-xl text-white">
                    Update Password
                </h2>
                <p className="mt-1 text-sm text-neutral-400">
                    Ensure your account is using a long, random password to stay secure.
                </p>
            </header>

            <form onSubmit={updatePassword} className="space-y-6">
                <div>
                    <label htmlFor="current_password" className="block font-mono text-xs text-neutral-400 tracking-wider mb-2">
                        CURRENT PASSWORD
                    </label>
                    <input
                        id="current_password"
                        ref={currentPasswordInput}
                        type="password"
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        autoComplete="current-password"
                        className="w-full bg-neutral-900 border-2 border-neutral-800 text-white px-4 py-3 font-mono text-sm focus:border-orange-500 focus:outline-none transition-colors"
                    />
                    {errors.current_password && (
                        <p className="mt-2 font-mono text-xs text-red-400">{errors.current_password}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block font-mono text-xs text-neutral-400 tracking-wider mb-2">
                        NEW PASSWORD
                    </label>
                    <input
                        id="password"
                        ref={passwordInput}
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="new-password"
                        className="w-full bg-neutral-900 border-2 border-neutral-800 text-white px-4 py-3 font-mono text-sm focus:border-orange-500 focus:outline-none transition-colors"
                    />
                    {errors.password && (
                        <p className="mt-2 font-mono text-xs text-red-400">{errors.password}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password_confirmation" className="block font-mono text-xs text-neutral-400 tracking-wider mb-2">
                        CONFIRM NEW PASSWORD
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        autoComplete="new-password"
                        className="w-full bg-neutral-900 border-2 border-neutral-800 text-white px-4 py-3 font-mono text-sm focus:border-orange-500 focus:outline-none transition-colors"
                    />
                    {errors.password_confirmation && (
                        <p className="mt-2 font-mono text-xs text-red-400">{errors.password_confirmation}</p>
                    )}
                </div>

                <div className="flex items-center gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="btn-primary px-6 py-3 text-sm disabled:opacity-50"
                    >
                        {processing ? 'UPDATING...' : 'UPDATE PASSWORD'}
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
