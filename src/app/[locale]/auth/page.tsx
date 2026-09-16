'use client';

import { useState } from 'react';
import Image from 'next/image';
import AuthToggle from "@/components/auth/AuthToggle.compo";
import AuthMethodSelector from "@/components/auth/RegisterMethodSelector";

import {GoogleRegister} from "@/components/auth/GoogleRegister.compo";
import LoginForm from "@/components/auth/LoginForm.compo";
import RegisterForm from "@/components/auth/RegisterForm.compo";
import {LanguageButton} from "@/components/_share/language_model/LanguageSelectorBtn.compo";
import LanguageSelector from "@/components/_share/language_model/LanguageSelector.compo";



type AuthMode = 'login' | 'register';
type RegisterMethod = 'manual' | 'google';

interface AuthPageProps {
    initialMode?: AuthMode;
}

export default function AuthPage() {
    const [mode, setMode] = useState<AuthMode>('login');
    const [registerMethod, setRegisterMethod] =
        useState<RegisterMethod>('manual');

    return (
        <main className="relative h-screen overflow-hidden bg-background p-3 sm:p-5 md:p-6">
            <LanguageSelector/>

            <div className="mx-auto flex h-full min-h-0 max-w-6xl overflow-hidden rounded-3xl border border-border bg-surface shadow-xl">

                {/* LEFT - IMAGE */}
                <section className="relative hidden min-h-0 w-1/2 overflow-hidden md:block">
                    <img
                        src="https://images.unsplash.com/photo-1519608487953-e999c86e7455"
                        alt="Auth background"
                        className="h-full w-full object-cover"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40" />

                    {/* Text */}
                    <div className="absolute inset-x-0 bottom-0 p-8 text-white lg:p-12">
                        <h1 className="text-3xl font-bold lg:text-4xl">
                            Welcome to NONJ
                        </h1>

                        <p className="mt-3 max-w-md text-sm leading-6 text-white/80 lg:text-base">
                            Connect, share and practice together.
                        </p>
                    </div>
                </section>

                {/* RIGHT - AUTH */}
                <section className="flex min-h-0 w-full flex-col md:w-1/2">

                    <div
                        className={`p-4`}
                    >
                        <LanguageButton></LanguageButton>
                    </div>

                    {/* Header */}
                    <div className="flex shrink-0 items-center justify-center px-5 pt-8 sm:px-8 md:pt-10">
                        <AuthToggle
                            mode={mode}
                            onChange={setMode}
                        />
                    </div>

                    {/* Form area */}
                    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-8 sm:px-8 md:px-10 lg:px-14 scrollbar-none [&::-webkit-scrollbar]:hidden">

                        {/* Register method */}
                        {mode === 'register' && (
                            <AuthMethodSelector
                                method={registerMethod}
                                onChange={setRegisterMethod}
                            />
                        )}

                        {/* Forms */}
                        <div className="mt-6">
                            {mode === 'login' ? (
                                <LoginForm />
                            ) : registerMethod === 'manual' ? (
                                <RegisterForm />
                            ) : (
                                <GoogleRegister />
                            )}
                        </div>

                    </div>
                </section>
            </div>
        </main>
    );
}