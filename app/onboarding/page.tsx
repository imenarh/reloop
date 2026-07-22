import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/mock';
import { OnboardingForm } from './onboarding-form';

export default async function OnboardingPage() {
    const currentUser = await requireUser();

    if (currentUser.onboardedAt) {
        redirect('/');
    }

    return (
        <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-muted/30 px-4 py-16">
            <OnboardingForm
                defaultName={currentUser.name ?? ''}
                defaultBio={''}
                defaultImage={currentUser.image ?? null}
            />
        </div>
    );
}
