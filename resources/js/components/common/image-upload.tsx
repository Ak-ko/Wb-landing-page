/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChunkUpload } from '@/hooks/use-chunk-upload';
import { AlertCircle, CheckCircle2, Pause, Play, RefreshCw, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Label } from '../ui/label';

// Upload states
type UploadState = 'idle' | 'uploading' | 'paused' | 'error' | 'completed';

interface ImageUploaderProps {
    initialImage?: string | null;
    onImageChange: (file: File | string) => void;
    onImageRemove: () => void;
    error?: string;
    aspectRatio?: string;
    maxSizeMB?: number;
    acceptedFormats?: string;
    placeholderText?: string;
    helperText?: string;
    uploadUrl?: string;
    cancelUrl?: string;
    onUploadStateChange?: (state: UploadState) => void;
}

export default function ImageUploader({
    initialImage = null,
    onImageChange,
    onImageRemove,
    error,
    aspectRatio = 'aspect-video',
    maxSizeMB = 10,
    acceptedFormats = 'image/*',
    placeholderText = 'Click to upload or drag and drop',
    helperText = 'SVG, PNG, JPG or GIF (max. 10MB)',
    uploadUrl = route('api.image.upload'),
    cancelUrl = route('api.image.upload.cancel'),
    onUploadStateChange,
}: ImageUploaderProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(initialImage);
    const [fileError, setFileError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [uploadState, setUploadState] = useState<UploadState>('idle');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const chunkUpload = useChunkUpload();
    const [uploader, setUploader] = useState<any>(null);
    const uploaderRef = useRef<any>(null);
    const uploadInitiatedRef = useRef<boolean>(false);

    useEffect(() => {
        setImagePreview(initialImage);
    }, [initialImage]);

    // Notify parent component when upload state changes
    useEffect(() => {
        if (onUploadStateChange) {
            onUploadStateChange(uploadState);
        }
    }, [uploadState, onUploadStateChange]);

    useEffect(() => {
        // Only create a new uploader if we have a file and haven't already initiated an upload
        if (selectedFile && !uploadInitiatedRef.current) {
            uploadInitiatedRef.current = true;

            // @ts-expect-error  @ts-ignore
            const newUploader = chunkUpload({
                url: uploadUrl,
                file: selectedFile,
                chunkSize: 1024 * 1024, // 1MB chunks
                simultaneousUploads: 3,
                onProgress: (progress: number) => {
                    setUploadProgress(progress);
                },
                onComplete: (response: any) => {
                    setUploadState('completed');
                    console.log('Upload complete:', response);
                    if (response && response.path) {
                        onImageChange(response.path);
                    }
                },
                onError: (err: any) => {
                    console.error('Upload error:', err);
                    setUploadState('error');
                    setFileError(`Upload failed: ${err.message || 'Unknown error'}`);
                },
            });

            setUploader(newUploader);
            uploaderRef.current = newUploader;
            setUploadState('uploading');
        }

        return () => {
            if (uploader && uploader.abort && uploadState !== 'paused') {
                uploader.abort();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFile]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size
        if (file.size > maxSizeMB * 1024 * 1024) {
            setFileError(`File size exceeds ${maxSizeMB}MB limit`);
            return;
        }

        setFileError(null);
        setUploadState('idle');
        uploadInitiatedRef.current = false;

        // Preview the image
        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Set the selected file to trigger the upload
        setSelectedFile(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        setFileError(null);
        setUploadProgress(0);
        setSelectedFile(null);
        setUploadState('idle');
        uploadInitiatedRef.current = false;

        if (uploaderRef.current && uploaderRef.current.abort) {
            uploaderRef.current.abort();

            // Call cancel endpoint if we were in the middle of an upload
            if (uploadState === 'uploading' || uploadState === 'paused') {
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

        onImageRemove();
    };

    const pauseUpload = () => {
        if (uploaderRef.current && uploaderRef.current.pause) {
            uploaderRef.current.pause();
            setUploadState('paused');
        }
    };

    const resumeUpload = () => {
        if (uploaderRef.current && uploaderRef.current.resume) {
            uploaderRef.current.resume();
            setUploadState('uploading');
        }
    };

    const retryUpload = () => {
        uploadInitiatedRef.current = false;
        setUploadState('idle');
        setFileError(null);

        // Re-trigger the upload effect
        if (selectedFile) {
            const fileCopy = selectedFile;
            setSelectedFile(null);
            setTimeout(() => setSelectedFile(fileCopy), 10);
        }
    };

    // Circular progress indicator
    const CircularProgress = ({ progress }: { progress: number }) => {
        const circumference = 2 * Math.PI * 45; // 45 is the radius
        const strokeDashoffset = circumference - (progress / 100) * circumference;

        return (
            <div className="relative flex items-center justify-center">
                <svg className="h-32 w-32 -rotate-90 transform">
                    {/* Background circle */}
                    <circle cx="50%" cy="50%" r="45" stroke="#e2e8f0" strokeWidth="8" fill="none" />
                    {/* Progress circle */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r="45"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="none"
                        className="text-primary transition-all duration-300 ease-in-out"
                    />
                </svg>
                <div className="absolute text-2xl font-bold">{Math.round(progress)}%</div>
            </div>
        );
    };

    // Render upload controls for the circular progress
    const renderCircularUploadControls = () => {
        return (
            <div className="mt-4 flex justify-center space-x-4">
                {uploadState === 'uploading' && (
                    <Button type="button" variant="outline" size="sm" onClick={pauseUpload} className="flex items-center space-x-1">
                        <Pause className="h-4 w-4" />
                        <span>Pause</span>
                    </Button>
                )}

                {uploadState === 'paused' && (
                    <Button type="button" variant="outline" size="sm" onClick={resumeUpload} className="flex items-center space-x-1">
                        <Play className="h-4 w-4" />
                        <span>Resume</span>
                    </Button>
                )}

                <Button type="button" variant="destructive" size="sm" onClick={removeImage} className="flex items-center space-x-1">
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                </Button>
            </div>
        );
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium">Image</label>

            {imagePreview ? (
                <div className={`relative ${aspectRatio} w-full overflow-hidden rounded-md bg-gray-100 shadow-md transition-all hover:shadow-lg`}>
                    <img
                        src={imagePreview}
                        alt="Image preview"
                        className={`h-full w-full object-contain ${uploadState === 'uploading' || uploadState === 'paused' ? 'opacity-40' : ''}`}
                    />

                    {/* Upload overlay with circular progress */}
                    {(uploadState === 'uploading' || uploadState === 'paused') && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 backdrop-blur-[2px]">
                            <div className="flex flex-col items-center">
                                <CircularProgress progress={uploadProgress} />
                                <div className="mt-2 text-center font-medium">{uploadState === 'uploading' ? 'Uploading...' : 'Paused'}</div>
                                {renderCircularUploadControls()}
                            </div>
                        </div>
                    )}

                    {/* Error overlay */}
                    {uploadState === 'error' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 p-6 backdrop-blur-sm">
                            <div className="mb-4 rounded-full bg-red-100 p-3">
                                <AlertCircle className="h-8 w-8 text-red-500" />
                            </div>
                            <p className="mb-4 text-center text-sm font-medium text-red-500">{fileError || 'Upload failed'}</p>
                            <div className="flex justify-center space-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={retryUpload}
                                    className="flex items-center space-x-1 border-red-200 text-red-500 hover:bg-red-50"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    <span>Retry</span>
                                </Button>
                                <Button type="button" variant="destructive" size="sm" onClick={removeImage} className="flex items-center space-x-1">
                                    <X className="h-4 w-4" />
                                    <span>Cancel</span>
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Success overlay */}
                    {uploadState === 'completed' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 p-6 backdrop-blur-[1px]">
                            <div className="mb-4 animate-bounce rounded-full bg-green-100 p-3">
                                <CheckCircle2 className="h-8 w-8 text-green-500" />
                            </div>
                            <p className="mb-4 rounded-full bg-white/80 px-4 py-2 text-center text-sm font-medium text-green-500 shadow-sm">
                                Upload completed successfully!
                            </p>
                        </div>
                    )}

                    {/* Only show remove button when not uploading */}
                    {uploadState !== 'uploading' && uploadState !== 'paused' && (
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 z-10 opacity-80 transition-opacity hover:opacity-100"
                            onClick={removeImage}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            ) : (
                <Label
                    htmlFor="file"
                    className="hover:border-primary/50 relative flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 transition-all hover:bg-gray-50"
                >
                    <div className="mb-2 rounded-full bg-gray-100 p-3">
                        <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="mb-2 text-sm text-gray-500">{placeholderText}</p>
                    <p className="text-xs text-gray-400">{helperText}</p>
                    <Input
                        id="file"
                        type="file"
                        accept={acceptedFormats}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        onChange={handleImageChange}
                        disabled={uploadState === 'uploading' || uploadState === 'paused'}
                    />

                    {(uploadState === 'uploading' || uploadState === 'paused') && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 p-6 backdrop-blur-sm transition-all">
                            <div className="flex flex-col items-center">
                                <CircularProgress progress={uploadProgress} />
                                <div className="mt-2 text-center font-medium">{uploadState === 'uploading' ? 'Uploading...' : 'Paused'}</div>
                                {renderCircularUploadControls()}
                            </div>
                        </div>
                    )}

                    {uploadState === 'error' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 p-6 backdrop-blur-sm">
                            <div className="mb-4 rounded-full bg-red-100 p-3">
                                <AlertCircle className="h-8 w-8 text-red-500" />
                            </div>
                            <p className="mb-4 text-center text-sm font-medium text-red-500">{fileError || 'Upload failed'}</p>
                            <div className="flex justify-center space-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={retryUpload}
                                    className="flex items-center space-x-1 border-red-200 text-red-500 hover:bg-red-50"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    <span>Retry</span>
                                </Button>
                                <Button type="button" variant="destructive" size="sm" onClick={removeImage} className="flex items-center space-x-1">
                                    <X className="h-4 w-4" />
                                    <span>Cancel</span>
                                </Button>
                            </div>
                        </div>
                    )}

                    {uploadState === 'completed' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 p-6 backdrop-blur-sm">
                            <div className="mb-4 rounded-full bg-green-100 p-3">
                                <CheckCircle2 className="h-8 w-8 text-green-500" />
                            </div>
                            <p className="mb-4 text-center text-sm font-medium text-green-500">Upload completed successfully!</p>
                        </div>
                    )}
                </Label>
            )}
            {(error || fileError) && uploadState !== 'error' && <p className="text-sm text-red-500">{error || fileError}</p>}
        </div>
    );
}
