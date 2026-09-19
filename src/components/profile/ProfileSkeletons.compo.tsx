import { Card } from '@/components/ui/card';

export function ProfileSkeleton() {
    return (
        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
            <div className="h-8 w-40 animate-pulse rounded bg-surface-hover" />
            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-surface-hover" />

            <Card className="mt-6 p-5 sm:p-6">
                <div className="flex flex-col items-center gap-5 sm:flex-row">
                    <div className="h-24 w-24 animate-pulse rounded-full bg-surface-hover sm:h-28 sm:w-28" />
                    <div className="space-y-3">
                        <div className="h-5 w-32 animate-pulse rounded bg-surface-hover" />
                        <div className="h-4 w-40 animate-pulse rounded bg-surface-hover" />
                        <div className="h-4 w-56 animate-pulse rounded bg-surface-hover" />
                    </div>
                </div>
            </Card>

            <Card className="mt-4 h-64 animate-pulse bg-surface-hover" />
        </div>
    );
}