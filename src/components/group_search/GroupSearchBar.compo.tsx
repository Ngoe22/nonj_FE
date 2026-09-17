'use client';

import { useState } from 'react';
import {
    AtSign,
    Check,
    ChevronDown,
    Search, TextInitial,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';



import type { SearchGroupMode } from './SearchGroupTypes';



interface GroupSearchBarProps {
    mode: SearchGroupMode;
    onModeChange: (mode: SearchGroupMode) => void;
    onSearch: (keyword: string) => void;
}

const modeLabel: Record<SearchGroupMode, string> = {
    slug: 'Search by slug',
    name: 'Search by name',
};

export default function GroupSearchBar({mode, onModeChange, onSearch}: GroupSearchBarProps) {
    const [keyword, setKeyword] = useState('');

    const handleSearch = () => {
        onSearch(keyword.trim());
    };

    return (
        <div className="flex w-full gap-2">
            <div className="relative flex min-w-0 flex-1 align-middle gap-2">

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-11 w-11 shrink-0"
                        >
                            { mode === 'slug' ?  <AtSign size={18} /> : <TextInitial size={18} /> }
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() =>
                                onModeChange('slug')
                            }
                        >
                            <span>Search by slug</span>

                            {mode === 'slug' && (
                                <Check
                                    size={16}
                                    className="ml-auto"
                                />
                            )}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() =>
                                onModeChange('name')
                            }
                        >
                            <span>Search by name</span>

                            {mode === 'name' && (
                                <Check
                                    size={16}
                                    className="ml-auto"
                                />
                            )}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Input
                    value={keyword}
                    onChange={(e) =>
                        setKeyword(e.target.value)
                    }
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                    placeholder={
                        mode === 'slug'
                            ? 'Search group by slug...'
                            : 'Search group by name...'
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
                Search
            </Button>
        </div>
    );
}