import {useTranslations} from "next-intl";


export  function GoogleRegister() {

    const txt = useTranslations('Auth')

    return (
        <div className="rounded-2xl border border-border bg-background p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-lg font-bold">
                G
            </div>

            <h2 className="mt-4 text-lg font-semibold text-foreground">
                {txt('register_with_gg')}
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted">
                Google registration sẽ được tích hợp sau.
            </p>

            <button
                type="button"
                disabled
                className="mt-5 w-full rounded-xl border border-border bg-surface-hover px-4 py-3 text-sm font-medium text-muted"
            >
                {txt('register_continue_with_gg')}
            </button>
        </div>
    );
}