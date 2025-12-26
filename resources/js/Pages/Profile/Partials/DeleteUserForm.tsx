import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function DeleteUserForm() {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section>
            <header className="mb-6">
                <h2 className="font-bold text-xl text-white">
                    Delete Account
                </h2>
                <p className="mt-1 text-sm text-neutral-400">
                    Once your account is deleted, all of its resources and data will be permanently deleted.
                </p>
            </header>

            <button
                onClick={confirmUserDeletion}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 text-sm uppercase tracking-wider transition-colors"
            >
                DELETE ACCOUNT
            </button>

            {confirmingUserDeletion && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/80"
                        onClick={closeModal}
                    />

                    <div className="relative card-brutal p-8 max-w-md w-full mx-4">
                        <h2 className="font-bold text-xl text-white mb-4">
                            Are you sure?
                        </h2>

                        <p className="text-sm text-neutral-400 mb-6">
                            Once your account is deleted, all of its resources and data will be permanently deleted.
                            Please enter your password to confirm.
                        </p>

                        <form onSubmit={deleteUser}>
                            <div className="mb-6">
                                <label htmlFor="delete-password" className="block font-mono text-xs text-neutral-400 tracking-wider mb-2">
                                    PASSWORD
                                </label>
                                <input
                                    id="delete-password"
                                    type="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full bg-neutral-900 border-2 border-neutral-800 text-white px-4 py-3 font-mono text-sm focus:border-red-500 focus:outline-none transition-colors"
                                />
                                {errors.password && (
                                    <p className="mt-2 font-mono text-xs text-red-400">{errors.password}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="btn-secondary px-6 py-3 text-sm"
                                >
                                    CANCEL
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 text-sm uppercase tracking-wider transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'DELETING...' : 'DELETE ACCOUNT'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
