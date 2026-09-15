'use client';

type RegisterMethod = 'manual' | 'google';

interface AuthMethodSelectorProps {
    method: RegisterMethod;
    onChange: (method: RegisterMethod) => void;
}

export default function AuthMethodSelector({method, onChange,}: AuthMethodSelectorProps) {
    return (
        <div>
            <p className="mb-3 text-sm font-medium text-foreground">
                Phương thức đăng ký
            </p>

            <div className="grid grid-cols-2 gap-2">
                <button
                    type="button"
                    onClick={() => onChange('manual')}
                    className={`
                        rounded-xl border px-4 py-3 text-sm font-medium
                        transition
                        ${
                        method === 'manual'
                            ? 'border-border-strong bg-surface-hover text-foreground'
                            : 'border-border text-muted hover:bg-surface-hover hover:text-foreground'
                    }
                    `}
                >
                    Manual
                </button>

                <button
                    type="button"
                    onClick={() => onChange('google')}
                    className={`
                        rounded-xl border px-4 py-3 text-sm font-medium
                        transition
                        ${
                        method === 'google'
                            ? 'border-border-strong bg-surface-hover text-foreground'
                            : 'border-border text-muted hover:bg-surface-hover hover:text-foreground'
                    }
                    `}
                >
                    Google
                </button>
            </div>
        </div>
    );
}