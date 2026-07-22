'use client';

import { useState, useCallback } from 'react';

const MAX_FILES = 8;

export interface UploadProgress {
    completed: number;
    total: number;
}

/**
 * Uploads image files directly to R2 via the presigned URL contract from
 * /api/upload: POST {fileName, contentType, contentLength} -> {uploadUrl, publicUrl},
 * then PUT the file bytes to uploadUrl. Returns the publicUrls in the same
 * order as the input files.
 */
export function useImageUpload() {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState<UploadProgress>({ completed: 0, total: 0 });

    const upload = useCallback(async (files: File[]): Promise<string[]> => {
        if (files.length === 0) return [];
        if (files.length > MAX_FILES) {
            throw new Error(`You can upload at most ${MAX_FILES} images at once.`);
        }

        setUploading(true);
        setProgress({ completed: 0, total: files.length });

        try {
            const urls: string[] = [];
            for (const file of files) {
                try {
                    const presignRes = await fetch('/api/upload', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            fileName: file.name,
                            contentType: file.type,
                            contentLength: file.size,
                        }),
                    });

                    if (!presignRes.ok) {
                        const body = await presignRes.json().catch(() => ({}));
                        throw new Error(body?.message ?? 'Could not get an upload URL.');
                    }

                    const { uploadUrl, publicUrl } = (await presignRes.json()) as {
                        uploadUrl: string;
                        publicUrl: string;
                    };

                    const putRes = await fetch(uploadUrl, {
                        method: 'PUT',
                        body: file,
                        headers: { 'Content-Type': file.type },
                    });

                    if (!putRes.ok) {
                        throw new Error('Upload to storage failed.');
                    }

                    urls.push(publicUrl);
                } catch (err) {
                    const message = err instanceof Error ? err.message : 'Unknown error';
                    throw new Error(`Failed to upload "${file.name}": ${message}`);
                } finally {
                    setProgress((p) => ({ ...p, completed: p.completed + 1 }));
                }
            }

            return urls;
        } finally {
            setUploading(false);
        }
    }, []);

    return { upload, uploading, progress };
}
