'use client';

import { useState } from 'react';
import {
    Check,
    Clock,
    Search,
    UserPlus,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {searchUser} from "@/mock/group";
import FriendUserInfo from "@/components/friend/FriendUserInfo.compo";




export default function FriendSearch() {
    const [keyword, setKeyword] = useState('');
    const [searched, setSearched] = useState(false);

    const [requestStatus, setRequestStatus] = useState<
        'idle' | 'pending'
    >('idle');

    const handleSearch = () => {
        if (!keyword.trim()) {
            setSearched(false);
            return;
        }

        // Mock search
        setSearched(true);
    };

    const handleAddFriend = () => {
        // Mock API
        setRequestStatus('pending');
    };

    const matched =
        searched &&
        (
            searchUser.user_name
                .toLowerCase()
                .includes(keyword.toLowerCase()) ||
            searchUser.nickname
                .toLowerCase()
                .includes(keyword.toLowerCase())
        );

    return (
        <div className="relative">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search
                        size={18}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <Input
                        value={keyword}
                        onChange={(e) => {
                            setKeyword(e.target.value);
                            setSearched(false);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                        placeholder="Search username..."
                        className="h-11 pl-10"
                    />
                </div>

                <Button
                    type="button"
                    size="icon"
                    className="h-11 w-11 shrink-0"
                    onClick={handleSearch}
                    disabled={!keyword.trim()}
                >
                    <Search size={18} />
                </Button>
            </div>

            {matched && (
                <Card className="absolute left-0 right-0 top-14 z-30 p-3 shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="min-w-0 flex-1">
                            <FriendUserInfo user={searchUser} />
                        </div>

                        {requestStatus === 'idle' && (
                            <Button
                                size="sm"
                                onClick={handleAddFriend}
                                className="shrink-0"
                            >
                                <UserPlus size={16} />
                                Add friend
                            </Button>
                        )}

                        {requestStatus === 'pending' && (
                            <Button
                                size="sm"
                                variant="secondary"
                                disabled
                                className="shrink-0"
                            >
                                <Clock size={16} />
                                Pending
                            </Button>
                        )}
                    </div>
                </Card>
            )}

            {searched && !matched && (
                <Card className="absolute left-0 right-0 top-14 z-30 p-5 shadow-lg">
                    <p className="text-center text-sm text-muted-foreground">
                        No user found.
                    </p>
                </Card>
            )}
        </div>
    );
}