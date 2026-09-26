'use client';

import { useEffect, useState } from 'react';
import { AtSign, Check, Search, TextInitial } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { SearchGroupMode } from '@/types/group_search/group_search.type';

interface Props {
    mode: SearchGroupMode;
    onModeChange: (mode: SearchGroupMode) => void;
    onSearch: (keyword: string) => void;
}

export default function GroupSearchBar({ mode, onModeChange, onSearch }: Props) {
    const txt = useTranslations('Group_search');
    const [keyword, setKeyword] = useState('');

    // Reset keyword khi đổi mode
    useEffect(() => {
        setKeyword('');
        onSearch('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    const handleSearch = () => {
        onSearch(keyword.trim());
    };

    return (
        <div className="flex w-full gap-2">
            <div className="relative flex min-w-0 flex-1 items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-11 w-11 shrink-0"
                        >
                            {mode === 'slug' ? <AtSign size={18} /> : <TextInitial size={18} />}
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onModeChange('slug')}>
                            <span>{txt('search_by_group_code')}</span>
                            {mode === 'slug' && <Check size={16} className="ml-auto" />}
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => onModeChange('name')}>
                            <span>{txt('search_by_name')}</span>
                            {mode === 'name' && <Check size={16} className="ml-auto" />}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearch();
                    }}
                    placeholder={
                        mode === 'slug'
                            ? `${txt('search_by_group_code')} ...`
                            : `${txt('search_by_name')} ...`
                    }
                    className="h-11 pl-5 pr-5"
                />
            </div>

            <Button
                type="button"
                onClick={handleSearch}
                disabled={!keyword.trim()}
                className="h-11"
            >
                <Search size={16} />
                {txt('search')}
            </Button>
        </div>
    );
}