'use client';

import { useRef } from 'react';
import { Image as ImageIcon, Music, X, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { useUploadFile } from '@/hooks/upload/use_upload_file.hook';
import type { UploadFileType } from '@/types/upload/upload.type';

interface Props {
    fileType: UploadFileType;
    value?: string;
    onChange: (url: string | null) => void;
    disabled?: boolean;
}

export function FileUploadButton({ fileType, value, onChange, disabled }: Props) {
    const txt = useTranslations('Upload');
    const inputRef = useRef<HTMLInputElement>(null);
    const upload = useUploadFile();

    const accept =
        fileType === 'image' ? 'image/png,image/jpeg,image/webp' : 'audio/mpeg,audio/mp3';
    const Icon = fileType === 'image' ? ImageIcon : Music;
    const label = fileType === 'image' ? txt('upload_image') : txt('upload_audio');

    const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = ''; // reset để chọn lại cùng file
        if (!file) return;

        const res = await upload.mutateAsync({ file, fileType });
        onChange(res.publicUrl);
    };

    // ✅ Đã có file → hiện preview + nút xóa
    if (value) {
        return (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-hover p-2">
                {fileType === 'image' && (
                    <img
                        src={value}
        alt="preview"
        className="h-10 w-10 rounded object-cover"
            />
    )}
        {fileType === 'audio' && (
            <audio controls src={value} className="h-8 max-w-[200px]" />
        )}

        <button
            type="button"
        onClick={() => onChange(null)}
        className="ml-auto flex h-7 w-7 items-center justify-center rounded-full text-red-600 hover:bg-red-50"
        aria-label="Remove"
        >
        <X size={14} />
        </button>
        </div>
    );
    }

    // ✅ Chưa có file → hiện nút upload
    return (
        <>
            <input
                ref={inputRef}
    type="file"
    accept={accept}
    onChange={handleSelect}
    className="hidden"
    />

    <Button
        type="button"
    variant="outline"
    size="sm"
    disabled={disabled || upload.isPending}
    onClick={() => inputRef.current?.click()}
    className="gap-2"
        >
        {upload.isPending ? (
                <Loader2 size={14} className="animate-spin" />
) : (
        <Icon size={14} />
)}
    {upload.isPending ? txt('uploading') : label}
    </Button>
    </>
);
}