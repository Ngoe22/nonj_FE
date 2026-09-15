'use client';

type AuthMode = 'login' | 'register';

interface AuthToggleProps {
    mode: AuthMode;
    onChange: (mode: AuthMode) => void;
}

export default function AuthToggle({mode, onChange}: AuthToggleProps) {
    return (
        <div className="flex w-full max-w-sm rounded-xl border border-border bg-background p-1">
            <button
                type="button"
                onClick={() => onChange('login')}
                className={`
                    flex-1 rounded-lg px-4 py-2.5 text-sm font-medium
                    transition
                    ${
                    mode === 'login'
                        ? 'bg-surface text-foreground shadow-sm'
                        : 'text-muted hover:text-foreground'
                }
                `}
            >
                Đăng nhập
            </button>

            <button
                type="button"
                onClick={() => onChange('register')}
                className={`
                    flex-1 rounded-lg px-4 py-2.5 text-sm font-medium
                    transition
                    ${
                    mode === 'register'
                        ? 'bg-surface text-foreground shadow-sm'
                        : 'text-muted hover:text-foreground'
                }
                `}
            >
                Đăng ký
            </button>

        </div>
    );
}