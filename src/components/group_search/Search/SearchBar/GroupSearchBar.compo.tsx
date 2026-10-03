'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { InvalidInput } from '@/components/_share/form_error_warning/FormErrorWarning.compo';

import {
    slugSearchSchema,
    nameSearchSchema,
    slugSearchDefaultValues,
    nameSearchDefaultValues,
    type SlugSearchFormValues,
} from '@/schemas/group_search/group_search.schema';
import type { SearchGroupMode } from '@/types/group_search/group_search.type';

interface Props {
    mode: SearchGroupMode;
    onModeChange: (mode: SearchGroupMode) => void;
    onSearch: (keyword: string) => void;
}

export default function GroupSearchBar({ mode, onModeChange, onSearch }: Props) {
    const txt = useTranslations('Group_search');
    const txtErr = useTranslations('Shema');

    // ✅ Schema thay đổi theo mode
    const schema = mode === 'slug' ? slugSearchSchema : nameSearchSchema;
    const defaults = mode === 'slug' ? slugSearchDefaultValues : nameSearchDefaultValues;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SlugSearchFormValues>({
        resolver: zodResolver(schema),
        defaultValues: defaults,
        // 'onChange' (không phải 'onSubmit'): lỗi phải phản ánh giá trị ĐANG gõ.
        // Với 'onSubmit', lỗi cũ vẫn hiện dù ô đã có chữ -> trông như app lỗi.
        mode: 'onChange',
        reValidateMode: 'onChange',
    });

    /**
     * Đổi mode + xoá keyword trong CÙNG một event.
     *
     * Trước đây xoá keyword trong `useEffect([mode])` — effect chạy SAU render,
     * nên render đầu tiên của mode mới vẫn mang keyword CŨ và mount query của
     * mode mới với keyword đó (tìm slug bằng tên hoặc ngược lại): tốn 1 request
     * sai và nháy kết quả không liên quan.
     */
    const changeMode = (next: SearchGroupMode) => {
        if (next === mode) return;
        onSearch('');
        reset(next === 'slug' ? slugSearchDefaultValues : nameSearchDefaultValues);
        onModeChange(next);
    };

    const submit = handleSubmit((values) => {
        onSearch(values.keyword.trim());
    });

    // Dịch error message
    // const errorMessage = errors.keyword?.message
    //     ? errors.keyword?.message
    //     : undefined;

    return (
        <form onSubmit={submit} className="w-full">
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
                            <DropdownMenuItem onClick={() => changeMode('slug')}>
                                <span>{txt('search_by_group_code')}</span>
                                {mode === 'slug' && <Check size={16} className="ml-auto" />}
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => changeMode('name')}>
                                <span>{txt('search_by_name')}</span>
                                {mode === 'name' && <Check size={16} className="ml-auto" />}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex-1 relative">
                        <Input
                            {...register('keyword')}
                            placeholder={
                                mode === 'slug'
                                    ? `${txt('search_by_group_code')} ...`
                                    : `${txt('search_by_name')} ...`
                            }
                            className="h-11 pl-5 pr-5"
                            autoComplete="off"
                            spellCheck={false}
                        />

                        {/* ✅ Hiện lỗi dưới input */}
                        {errors.keyword &&
                            <div className={"absolute top-1/1 left-0"} >
                                <InvalidInput msg={errors.keyword?.message} />
                            </div>
                        }
                    </div>
                </div>

                <Button type="submit" className="h-11">
                    <Search size={16} />
                    {txt('search')}
                </Button>
            </div>
        </form>
    );
}