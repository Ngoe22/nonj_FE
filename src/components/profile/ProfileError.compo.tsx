import { Card } from '@/components/ui/card';
import {useTranslations} from "next-intl";

interface Props {
    message?: string;
}

export function ProfileError({ message }: Props) {

    const txt = useTranslations('MyProfile')

    return (
        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
            <Card className="p-6 text-center">
                <p className="text-sm text-destructive">
                    {txt('load_fail')}
                </p>
                {/*{message && (*/}
                {/*    <p className="mt-1 text-xs text-muted-foreground">*/}
                {/*        {message}*/}
                {/*    </p>*/}
                {/*)}*/}
            </Card>
        </div>
    );
}