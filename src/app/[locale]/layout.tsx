
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {ToastContainer} from "react-toastify";
import Script from "next/script";

export default async function LocaleLayout(
    { children, params  }: {
    children: React.ReactNode;
    params: Promise<{locale: string}>;
}) {
    const {locale} = await params;

    if (!routing.locales.includes(locale as 'vi' | 'en')) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages}>
            <Script
                src="https://accounts.google.com/gsi/client"
                strategy="beforeInteractive"
            />
            <ToastContainer />
            {children}
        </NextIntlClientProvider>
    );
}