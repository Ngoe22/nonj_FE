export interface UploadFileResponse {
    uploadUrl: string;
    publicUrl: string;
    key: string;
    expiresAt: string;
    maxSize: number;
}

export type UploadFileType = 'image' | 'audio';
