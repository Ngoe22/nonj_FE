'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {authStore} from "@/stores/auth/auth.store";


const BE_URL = process.env.NEXT_PUBLIC_BE_URL || 'http://localhost:4000';

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.post<{ newAccessToken: string }>(
                    `${BE_URL}auth/refresh`,
                    {},
                    { withCredentials: true },
                );
                authStore.setAccessToken(data.newAccessToken);
            } catch {
                authStore.clear();
            } finally {
                setReady(true);
            }
        })();
    }, []);

    if (!ready) return null;   // ⬅️ CHẶN render — đây là điểm mấu chốt
    return <>{children}</>;
}