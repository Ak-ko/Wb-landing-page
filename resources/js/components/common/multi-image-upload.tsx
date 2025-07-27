import { ChunkUploadOptions, useChunkUpload } from '@/hooks/use-chunk-upload';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { Label } from '../ui/label';

type UploadState = 'idle' | 'uploading' | 'paused' | 'error' | 'completed';

interface UploaderInstance {
    abort: () => void;
    pause: () => void;
    resume: () => void;
}

interface UploadingFile {
    id: string;
    file: File;
    preview: string;
    progress: number;
    state: UploadState;
    error?: string;
    uploader?: UploaderInstance;
    isVideo?: boolean;
}

interface MultiImageUploaderProps {
    onImageChange: (file: File | string, index?: number, total?: number) => void;
    onImageRemove: (fileId: string) => void;
    error?: string;
    maxSizeMB?: number;
    acceptedFormats?: string;
    placeholderText?: string;
    helperText?: string;
    uploadUrl?: string;
    cancelUrl?: string;
    labelText?: 'Images' | 'Videos' | 'Media';
    maxFiles?: number;
    showLabel?: boolean;
}

export default function MultiImageUploader({
    onImageChange,
    onImageRemove,
    error,
    maxSizeMB = 300,
    acceptedFormats = 'image/*,video/*',
    placeholderText = 'Click to upload or drag and drop',
    helperText = 'SVG, PNG, JPG, GIF, MP4, WebM (max. 300 MB)',
    uploadUrl = route('api.image.upload'),
    labelText = 'Media',
    cancelUrl = route('api.image.upload.cancel'),
    maxFiles = 10,
    showLabel = true,
}: MultiImageUploaderProps) {
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
    const [fileError, setFileError] = useState<string | null>(null);
    const chunkUpload = useChunkUpload();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): string | null => {
        if (file.size > maxSizeMB * 1024 * 1024) {
            return `File ${file.name} exceeds ${maxSizeMB}MB limit`;
        }
        return null;
    };

    const isVideoFile = (file: File): boolean => {
        return file.type.startsWith('video/');
    };

    const createFilePreview = (file: File, fileId: string, index: number, total: number) => {
        const isVideo = isVideoFile(file);

        if (isVideo) {
            // For videos, create a video preview
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(video, 0, 0);
                    const preview = canvas.toDataURL('image/jpeg');

                    const newFile: UploadingFile = {
                        id: fileId,
                        file,
                        preview,
                        progress: 0,
                        state: 'idle',
                        isVideo: true,
                    };

                    setUploadingFiles((prev) => [...prev, newFile]);
                    startUpload(newFile, index, total);
                }
            };
            video.src = URL.createObjectURL(file);
        } else {
            // For images, use FileReader
            const reader = new FileReader();
            reader.onload = () => {
                const newFile: UploadingFile = {
                    id: fileId,
                    file,
                    preview: reader.result as string,
                    progress: 0,
                    state: 'idle',
                    isVideo: false,
                };

                setUploadingFiles((prev) => [...prev, newFile]);
                startUpload(newFile, index, total);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileSelect = (files: FileList | null) => {
        if (!files) return;

        const fileArray = Array.from(files);

        if (uploadingFiles.length + fileArray.length > maxFiles) {
            setFileError(`Maximum ${maxFiles} files allowed`);
            return;
        }

        setFileError(null);

        fileArray.forEach((file, index) => {
            const validationError = validateFile(file);
            if (validationError) {
                setFileError(validationError);
                return;
            }

            const fileId = `${Date.now()}-${Math.random()}`;
            createFilePreview(file, fileId, index, fileArray.length);
        });
    };

    const startUpload = (uploadingFile: UploadingFile, index: number, total: number) => {
        const uploader = (chunkUpload as (options: ChunkUploadOptions) => UploaderInstance)({
            url: uploadUrl,
            file: uploadingFile.file,
            chunkSize: 1024 * 1024,
            simultaneousUploads: 3,
            onProgress: (progress: number) => {
                const validProgress = Math.max(0, Math.min(100, progress));
                setUploadingFiles((prev) => prev.map((file) => (file.id === uploadingFile.id ? { ...file, progress: validProgress } : file)));
            },
            onComplete: (response: { path?: string }) => {
                setUploadingFiles((prev) => prev.filter((file) => file.id !== uploadingFile.id));

                if (response && response.path) {
                    onImageChange(response.path, index, total);
                }
            },
            onError: (err: Error) => {
                setUploadingFiles((prev) =>
                    prev.map((file) =>
                        file.id === uploadingFile.id
                            ? {
                                  ...file,
                                  state: 'error' as UploadState,
                                  error: `Upload failed: ${err.message || 'Unknown error'}`,
                              }
                            : file,
                    ),
                );
            },
        });

        setUploadingFiles((prev) =>
            prev.map((file) => (file.id === uploadingFile.id ? { ...file, uploader, state: 'uploading' as UploadState } : file)),
        );
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFileSelect(e.target.files);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        handleFileSelect(e.dataTransfer.files);
    };

    const updateFileState = (fileId: string, state: UploadState, action?: () => void) => {
        setUploadingFiles((prev) =>
            prev.map((file) => {
                if (file.id === fileId) {
                    action?.();
                    return { ...file, state };
                }
                return file;
            }),
        );
    };

    const pauseUpload = (fileId: string) => {
        updateFileState(fileId, 'paused', () => {
            const file = uploadingFiles.find((f) => f.id === fileId);
            file?.uploader?.pause();
        });
    };

    const resumeUpload = (fileId: string) => {
        updateFileState(fileId, 'uploading', () => {
            const file = uploadingFiles.find((f) => f.id === fileId);
            file?.uploader?.resume();
        });
    };

    const retryUpload = (fileId: string) => {
        const file = uploadingFiles.find((f) => f.id === fileId);
        if (file) {
            setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId));
            const newFile: UploadingFile = {
                ...file,
                progress: 0,
                state: 'idle',
                error: undefined,
                uploader: undefined,
            };
            setUploadingFiles((prev) => [...prev, newFile]);
            startUpload(newFile, 0, 1);
        }
    };

    const cancelUpload = (fileId: string) => {
        setUploadingFiles((prev) =>
            prev.map((file) => {
                if (file.id === fileId && file.uploader?.abort) {
                    file.uploader.abort();

                    if (file.state === 'uploading' || file.state === 'paused') {
                        if (cancelUrl) {
                            fetch(cancelUrl, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                                },
                            }).catch((err) => console.error('Failed to cancel upload:', err));
                        }
                    }
                }
                return file;
            }),
        );

        setTimeout(() => {
            setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId));
            onImageRemove(fileId);
        }, 100);
    };

    return (
        <div className="space-y-4">
            {showLabel && <label className="block text-sm font-medium">{labelText}</label>}

            <Label
                htmlFor="multi-file"
                className="hover:border-primary/50 relative flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 transition-all hover:bg-gray-50"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <motion.div
                    className="mb-2 rounded-full bg-gray-100 p-3"
                    whileHover={{ scale: 1.1, backgroundColor: '#f0f9ff' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                    <Upload className="h-8 w-8 text-gray-400" />
                </motion.div>
                <p className="mb-2 text-sm text-gray-500">{placeholderText}</p>
                <p className="text-xs text-gray-400">{helperText}</p>
                <p className="text-xs text-gray-400">Max {maxFiles} files</p>
                <input
                    ref={fileInputRef}
                    id="multi-file"
                    type="file"
                    accept={acceptedFormats}
                    multiple
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    onChange={handleImageChange}
                />
            </Label>

            {(error || fileError) && <p className="text-sm text-red-500">{error || fileError}</p>}

            {uploadingFiles.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Uploading Files ({uploadingFiles.length})</h4>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {uploadingFiles.map((file) => (
                            <UploadingFileCard
                                key={file.id}
                                file={file}
                                onPause={() => pauseUpload(file.id)}
                                onResume={() => resumeUpload(file.id)}
                                onRetry={() => retryUpload(file.id)}
                                onCancel={() => cancelUpload(file.id)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

interface UploadingFileCardProps {
    file: UploadingFile;
    onPause: () => void;
    onResume: () => void;
    onRetry: () => void;
    onCancel: () => void;
}

function UploadingFileCard({ file, onPause, onResume, onRetry, onCancel }: UploadingFileCardProps) {
    const getStatusColor = () => {
        switch (file.state) {
            case 'uploading':
                return 'text-blue-600';
            case 'paused':
                return 'text-yellow-600';
            case 'error':
                return 'text-red-600';
            case 'completed':
                return 'text-green-600';
            default:
                return 'text-gray-600';
        }
    };

    const getStatusText = () => {
        switch (file.state) {
            case 'uploading':
                return 'Uploading...';
            case 'paused':
                return 'Paused';
            case 'error':
                return 'Error';
            case 'completed':
                return 'Completed';
            default:
                return 'Idle';
        }
    };

    return (
        <div className="relative overflow-hidden rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                    {file.isVideo ? (
                        <div className="relative h-12 w-12 overflow-hidden rounded">
                            <img src={file.preview} alt={file.file.name} className="h-full w-full object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <div className="ml-1 h-0 w-0 border-t-[6px] border-b-[6px] border-l-[8px] border-t-transparent border-b-transparent border-l-white"></div>
                            </div>
                        </div>
                    ) : (
                        <img src={file.preview} alt={file.file.name} className="h-12 w-12 rounded object-cover" />
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{file.file.name}</p>
                    <p className={`text-xs ${getStatusColor()}`}>{getStatusText()}</p>
                    {file.state === 'uploading' && (
                        <div className="mt-1">
                            <div className="h-1 w-full rounded-full bg-gray-200">
                                <div className="h-1 rounded-full bg-blue-600 transition-all duration-300" style={{ width: `${file.progress}%` }} />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">{Math.round(file.progress)}%</p>
                        </div>
                    )}
                    {file.error && <p className="mt-1 text-xs text-red-500">{file.error}</p>}
                </div>
            </div>

            <div className="mt-3 flex space-x-2">
                {file.state === 'uploading' && (
                    <button onClick={onPause} className="rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 hover:bg-yellow-200">
                        Pause
                    </button>
                )}
                {file.state === 'paused' && (
                    <button onClick={onResume} className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 hover:bg-blue-200">
                        Resume
                    </button>
                )}
                {file.state === 'error' && (
                    <button onClick={onRetry} className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800 hover:bg-green-200">
                        Retry
                    </button>
                )}
                <button onClick={onCancel} className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800 hover:bg-red-200">
                    Cancel
                </button>
            </div>
        </div>
    );
}
