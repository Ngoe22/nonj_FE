'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ShieldAlert } from 'lucide-react';

import AdminUsersTab from '@/components/admin/AdminUsersTab.compo';
import AdminGroupsTab from '@/components/admin/AdminGroupsTab.compo';
import AdminPostsTab from '@/components/admin/AdminPostsTab.compo';
import AdminReportsTab from '@/components/admin/AdminReportsTab.compo';

import { useGetMyProfile } from '@/hooks/profile/useGetMyProfile.hook';

type Tab = 'users' | 'groups' | 'posts' | 'reports';

export default function AdminDashboard() {
    const txt = useTranslations('Admin');

    const { data: me, isLoading } = useGetMyProfile();

    const [tab, setTab] = useState<Tab>('users');
    /** sưu tập được chọn từ tab Groups -> nhảy sang tab Posts */
    const [collectionId, setCollectionId] = useState('');

    if (isLoading) {
        return (
            <p className="py-10 text-center text-sm text-muted-foreground">
                {txt('loading')}
            </p>
        );
    }

    if (me?.role !== 'SYSTEM_ADMIN') {
        return (
            <div className="flex min-h-64 flex-col items-center justify-center gap-2 text-center">
                <ShieldAlert size={30} className="text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                    {txt('no_permission')}
                </p>
            </div>
        );
    }

    const tabs: { key: Tab; label: string }[] = [
        { key: 'users', label: txt('tab_users') },
        { key: 'groups', label: txt('tab_groups') },
        { key: 'posts', label: txt('tab_posts') },
        { key: 'reports', label: txt('tab_reports') },
    ];

    return (
        <div className="mx-auto w-full max-w-5xl px-2 py-4 sm:px-4">
            <div className="border-b border-border pb-4">
                <h1 className="text-2xl font-bold tracking-tight">
                    {txt('title')}
                </h1>
            </div>

            {/* Tabs */}
            <div className="mt-4 flex flex-wrap gap-1.5">
                {tabs.map((item) => (
                    <button
                        key={item.key}
                        type="button"
                        onClick={() => {
                            setTab(item.key);
                            if (item.key !== 'posts') setCollectionId('');
                        }}
                        className={`rounded-xl px-3.5 py-2 text-sm font-medium transition ${
                            tab === item.key
                                ? 'bg-foreground text-background'
                                : 'border border-border hover:bg-surface-hover'
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <div className="mt-5">
                {tab === 'users' && <AdminUsersTab />}

                {tab === 'groups' && (
                    <AdminGroupsTab
                        onOpenCollection={(id) => {
                            setCollectionId(id);
                            setTab('posts');
                        }}
                    />
                )}

                {tab === 'posts' && (
                    // key để remount khi đổi sưu tập từ tab Groups
                    <AdminPostsTab
                        key={collectionId || 'picker'}
                        initialCollectionId={collectionId}
                    />
                )}

                {tab === 'reports' && <AdminReportsTab />}
            </div>
        </div>
    );
}
