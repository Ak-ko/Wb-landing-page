/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import Resumable from 'resumablejs';

export interface ChunkUploadOptions {
    url: string;
    file: File;
    chunkSize?: number;
    onProgress?: (progress: number) => void;
    onComplete?: (response: any) => void;
    onError?: (error: any) => void;
    headers?: Record<string, string>;
    simultaneousUploads?: number;
}

export function useChunkUpload(options?: ChunkUploadOptions) {
    const { csrf_token } = usePage().props;
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<any | null>(null);
    const resumableRef = useRef<Resumable | null>(null);
    const uploadCompletedRef = useRef(false);

    const createUploader = (opts: ChunkUploadOptions) => {
        const {
            url,
            file,
            chunkSize = 1024 * 1024 * 2, // 2MB chunks by default
            onProgress,
            onComplete,
            onError,
            headers = {},
            simultaneousUploads = 3,
        } = opts;

        // Create a new Resumable instance
        const resumable = new Resumable({
            target: url,
            chunkSize: chunkSize,
            simultaneousUploads: simultaneousUploads,
            testChunks: false,
            headers: {
                ...headers,
                'X-CSRF-TOKEN': csrf_token,
            },
            query: {},
            maxChunkRetries: 3,
            prioritizeFirstAndLastChunk: true,
            maxFiles: 1,
        });

        // Add event listeners
        resumable.on('fileAdded', function () {
            if (!uploadCompletedRef.current) {
                setIsUploading(true);
                setProgress(0);
                setError(null);
                resumable.upload();
            }
        });

        // @ts-expect-error @ts-ignore
        resumable.on('fileSuccess', function (file, response) {
            setIsUploading(false);
            uploadCompletedRef.current = true;
            try {
                const parsedResponse = JSON.parse(response);
                onComplete?.(parsedResponse);
            } catch (err) {
                onComplete?.(response);
            }
        });

        resumable.on('fileError', function (file, message) {
            setIsUploading(false);
            const err = new Error(message);
            setError(err);
            onError?.(err);
        });

        resumable.on('fileProgress', function (file) {
            const currentProgress = Math.floor(file.progress(true) * 100);
            setProgress(currentProgress);
            onProgress?.(currentProgress);
        });

        // Add the file to the uploader
        if (file) {
            const resumableFile = new File([file], file.name, { type: file.type });
            resumable.addFile(resumableFile);
        }

        return resumable;
    };

    const upload = (opts: ChunkUploadOptions) => {
        uploadCompletedRef.current = false;
        resumableRef.current = createUploader(opts);

        return {
            isUploading,
            progress,
            error,
            abort: () => {
                if (resumableRef.current) {
                    resumableRef.current.cancel();
                    setIsUploading(false);
                }
            },
            pause: () => {
                if (resumableRef.current) {
                    resumableRef.current.pause();
                }
            },
            resume: () => {
                if (resumableRef.current) {
                    resumableRef.current.upload();
                }
            },
        };
    };

    // If options are provided directly, create the uploader
    useEffect(() => {
        if (options && !resumableRef.current) {
            uploadCompletedRef.current = false;
            resumableRef.current = createUploader(options);
        }

        return () => {
            if (resumableRef.current) {
                resumableRef.current.cancel();
            }
        };
        // Only recreate when file changes, not on every render
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options?.file]);

    return options
        ? {
              isUploading,
              progress,
              error,
              abort: () => {
                  if (resumableRef.current) {
                      resumableRef.current.cancel();
                      setIsUploading(false);
                  }
              },
              pause: () => {
                  if (resumableRef.current) {
                      resumableRef.current.pause();
                  }
              },
              resume: () => {
                  if (resumableRef.current) {
                      resumableRef.current.upload();
                  }
              },
          }
        : upload;
}
