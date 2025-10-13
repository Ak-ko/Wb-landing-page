/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChunkUpload } from '@/hooks/use-chunk-upload';
import { AnimatePresence, motion } from 'framer-motion';
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
    labelText?: 'Image' | 'Video';
    onUploadStateChange?: (state: UploadState) => void;
}

export default function ImageUploader({
    initialImage = null,
    onImageChange,
    onImageRemove,
    error,
    aspectRatio = 'aspect-video',
    maxSizeMB = 300,
    acceptedFormats = 'image/*,video/*',
    placeholderText = 'Click to upload or drag and drop',
    helperText = 'SVG, PNG, JPG, GIF, MP4, WebM (max. 300 MB)',
    uploadUrl = route('api.image.upload'),
    labelText = 'Image',
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
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        setImagePreview(initialImage);
    }, [initialImage]);

    // Notify parent component when upload state changes
    useEffect(() => {
        if (onUploadStateChange) {
            onUploadStateChange(uploadState);
        }

        // Show success animation when upload completes
        if (uploadState === 'completed') {
            setShowSuccessAnimation(true);
            // Hide success animation after 2 seconds
            const timer = setTimeout(() => {
                setShowSuccessAnimation(false);
            }, 2000);
            return () => clearTimeout(timer);
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

        // Check if it's a video file
        const isVideo = file.type.startsWith('video/');

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
                    setImagePreview(preview);
                }
            };
            video.src = URL.createObjectURL(file);
        } else {
            // For images, use FileReader
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }

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

    // Drag and drop handlers
    const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (!file) return;

        // Validate file size
        if (file.size > maxSizeMB * 1024 * 1024) {
            setFileError(`File size exceeds ${maxSizeMB}MB limit`);
            return;
        }

        setFileError(null);
        setUploadState('idle');
        uploadInitiatedRef.current = false;

        // Check if it's a video file
        const isVideo = file.type.startsWith('video/');

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
                    setImagePreview(preview);
                }
            };
            video.src = URL.createObjectURL(file);
        } else {
            // For images, use FileReader
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }

        // Set the selected file to trigger the upload
        setSelectedFile(file);
    };

    // Improved Circular progress indicator with smooth animation
    const CircularProgress = ({ progress }: { progress: number }) => {
        const circumference = 2 * Math.PI * 45; // 45 is the radius
        const strokeDashoffset = circumference - (progress / 100) * circumference;

        return (
            <div className="relative flex items-center justify-center">
                <svg className="h-32 w-32 -rotate-90 transform">
                    {/* Background circle */}
                    <circle cx="50%" cy="50%" r="45" stroke="#e2e8f0" strokeWidth="8" fill="none" />
                    {/* Progress circle - with steady animation */}
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
                        className="text-primary"
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
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    >
                        <Button type="button" variant="outline" size="sm" onClick={pauseUpload} className="flex items-center space-x-1">
                            <Pause className="h-4 w-4" />
                            <span>Pause</span>
                        </Button>
                    </motion.div>
                )}

                {uploadState === 'paused' && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    >
                        <Button type="button" variant="outline" size="sm" onClick={resumeUpload} className="flex items-center space-x-1">
                            <Play className="h-4 w-4" />
                            <span>Resume</span>
                        </Button>
                    </motion.div>
                )}

                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                >
                    <Button type="button" variant="destructive" size="sm" onClick={removeImage} className="flex items-center space-x-1">
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                    </Button>
                </motion.div>
            </div>
        );
    };

    // Animation variants for different states
    const overlayVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    };

    const contentVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };

    const iconVariants = {
        initial: { scale: 0 },
        animate: { scale: 1, transition: { type: 'spring', stiffness: 200, damping: 10 } },
        exit: { scale: 0 },
    };

    // Success animation variants
    const successVariants = {
        initial: { scale: 0.8, opacity: 0 },
        animate: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.5,
                type: 'spring',
                stiffness: 200,
                damping: 15,
            },
        },
        exit: {
            scale: 1.2,
            opacity: 0,
            transition: {
                duration: 0.3,
            },
        },
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium">{labelText || 'Image'}</label>

            {imagePreview ? (
                <div
                    className={`relative ${aspectRatio} w-full min-w-[300px] overflow-hidden rounded-md bg-gray-100 shadow-md transition-all hover:shadow-lg`}
                >
                    <motion.div
                        className={`relative h-full w-full ${uploadState === 'uploading' || uploadState === 'paused' ? 'opacity-40' : ''}`}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <img src={imagePreview} alt="Media preview" className="h-full w-full object-contain" />
                        {selectedFile && selectedFile.type.startsWith('video/') && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80">
                                    <div className="ml-1 h-0 w-0 border-t-[8px] border-b-[8px] border-l-[12px] border-t-transparent border-b-transparent border-l-gray-800"></div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                    {/* Upload overlay with circular progress */}
                    <AnimatePresence mode="wait">
                        {(uploadState === 'uploading' || uploadState === 'paused') && (
                            <motion.div
                                className="absolute inset-0 flex flex-col items-center justify-center p-6 backdrop-blur-[2px]"
                                variants={overlayVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                key="uploading"
                            >
                                <motion.div
                                    className="flex flex-col items-center"
                                    variants={contentVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    <CircularProgress progress={uploadProgress} />
                                    <motion.div
                                        className="mt-2 text-center font-medium"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        {uploadState === 'uploading' ? 'Uploading...' : 'Paused'}
                                    </motion.div>
                                    {renderCircularUploadControls()}
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Error overlay */}
                        {uploadState === 'error' && (
                            <motion.div
                                className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 p-6 backdrop-blur-sm"
                                variants={overlayVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                key="error"
                            >
                                <motion.div
                                    className="mb-4 rounded-full bg-red-100 p-3"
                                    variants={iconVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                >
                                    <AlertCircle className="h-8 w-8 text-red-500" />
                                </motion.div>
                                <motion.p
                                    className="mb-4 text-center text-sm font-medium text-red-500"
                                    variants={contentVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ delay: 0.1 }}
                                >
                                    {fileError || 'Upload failed'}
                                </motion.p>
                                <motion.div
                                    className="flex justify-center space-x-2"
                                    variants={contentVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ delay: 0.2 }}
                                >
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
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={removeImage}
                                        className="flex items-center space-x-1"
                                    >
                                        <X className="h-4 w-4" />
                                        <span>Cancel</span>
                                    </Button>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Success overlay - only shown briefly when upload completes */}
                        {showSuccessAnimation && (
                            <motion.div
                                className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 p-6 backdrop-blur-[1px]"
                                variants={overlayVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                key="completed"
                            >
                                <motion.div
                                    className="flex flex-col items-center justify-center"
                                    variants={successVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                >
                                    <motion.div
                                        className="mb-4 rounded-full bg-green-100 p-3"
                                        initial={{ scale: 0 }}
                                        animate={{
                                            scale: [0, 1.2, 1],
                                            transition: {
                                                times: [0, 0.6, 1],
                                                duration: 0.6,
                                            },
                                        }}
                                    >
                                        <motion.div
                                            initial={{ rotate: -90, opacity: 0 }}
                                            animate={{
                                                rotate: 0,
                                                opacity: 1,
                                                transition: {
                                                    delay: 0.2,
                                                    duration: 0.3,
                                                },
                                            }}
                                        >
                                            <CheckCircle2 className="h-8 w-8 text-green-500" />
                                        </motion.div>
                                    </motion.div>
                                    <motion.div
                                        className="rounded-full bg-white/80 px-4 py-2 text-center text-sm font-medium text-green-500 shadow-sm"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            transition: {
                                                delay: 0.3,
                                                duration: 0.3,
                                            },
                                        }}
                                    >
                                        Upload completed!
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {/* Only show remove button when not uploading */}
                    {uploadState !== 'uploading' && uploadState !== 'paused' && !showSuccessAnimation && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 0.8, scale: 1 }}
                            whileHover={{ opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                        >
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 z-10 transition-opacity"
                                onClick={removeImage}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </motion.div>
                    )}
                </div>
            ) : (
                <Label
                    htmlFor="file"
                    className={`relative flex flex-col items-center justify-center rounded-md border-2 border-dashed p-6 transition-all ${
                        isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'hover:border-primary/50 border-gray-300 hover:bg-gray-50'
                    }`}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <motion.div
                        className={`mb-2 rounded-full p-3 ${isDragging ? 'bg-primary/10' : 'bg-gray-100'}`}
                        animate={isDragging ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                        transition={{ repeat: isDragging ? Infinity : 0, duration: 1 }}
                        whileHover={{ scale: 1.1, backgroundColor: '#f0f9ff' }}
                    >
                        <Upload className={`h-8 w-8 ${isDragging ? 'text-primary' : 'text-gray-400'}`} />
                    </motion.div>
                    <p className={`mb-2 text-sm ${isDragging ? 'text-primary font-medium' : 'text-gray-500'}`}>
                        {isDragging ? 'Drop your file here' : placeholderText}
                    </p>
                    <p className="text-xs text-gray-400">{helperText}</p>
                    <Input
                        id="file"
                        type="file"
                        accept={acceptedFormats}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        onChange={handleImageChange}
                        disabled={uploadState === 'uploading' || uploadState === 'paused'}
                    />

                    <AnimatePresence mode="wait">{/* ... existing code ... */}</AnimatePresence>
                </Label>
            )}
            {(error || fileError) && uploadState !== 'error' && <p className="text-sm text-red-500">{error || fileError}</p>}
        </div>
    );
}
