import ShopLayout from '@/Layouts/ShopLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import FlashMessage from '@/Components/FlashMessage';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <ShopLayout activeNav="dashboard">
            <Head title="Profile — TrustFactory" />
            <FlashMessage />

            <div className="max-w-4xl mx-auto px-6">
                <div className="mb-12">
                    <span className="font-mono text-xs text-orange-500 tracking-widest">ACCOUNT SETTINGS</span>
                    <h1 className="text-4xl lg:text-5xl font-black text-white mt-2">PROFILE</h1>
                </div>

                <div className="space-y-8">
                    <div className="card-brutal p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>

                    <div className="card-brutal p-8">
                        <UpdatePasswordForm />
                    </div>

                    <div className="card-brutal p-8">
                        <DeleteUserForm />
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}
