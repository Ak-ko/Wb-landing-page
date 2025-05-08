/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';

/**
 * Custom hook to extract the dominant color from an image
 * @param imageUrl - URL of the image to analyze
 * @param fallbackColor - Fallback color to use if extraction fails (default: #000000)
 * @returns An object containing the dominant color in hex format and loading state
 */
export function useImageColor(imageUrl: string, fallbackColor: string = '#000000') {
    const [dominantColor, setDominantColor] = useState<string>(fallbackColor);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!imageUrl) {
            setIsLoading(false);
            setError('No image URL provided');
            return;
        }

        setIsLoading(true);
        setError(null);

        const extractColor = async () => {
            try {
                // Create an image element
                const img = new Image();
                img.crossOrigin = 'Anonymous'; // Handle CORS issues

                img.onload = () => {
                    // Create a canvas to draw the image
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');

                    if (!context) {
                        setError('Canvas context not available');
                        setIsLoading(false);
                        return;
                    }

                    // Set canvas size to image size (can be reduced for performance)
                    const width = img.width;
                    const height = img.height;
                    canvas.width = width;
                    canvas.height = height;

                    // Draw image to canvas
                    context.drawImage(img, 0, 0, width, height);

                    // Get image data
                    const imageData = context.getImageData(0, 0, width, height).data;

                    // Process image data to find dominant color
                    const colorCounts: Record<string, number> = {};

                    // Sample pixels (skip some pixels for performance)
                    const sampleStep = Math.max(1, Math.floor((width * height) / 10000));

                    for (let i = 0; i < imageData.length; i += 4 * sampleStep) {
                        const r = imageData[i];
                        const g = imageData[i + 1];
                        const b = imageData[i + 2];
                        const a = imageData[i + 3];

                        // Skip transparent pixels
                        if (a < 128) continue;

                        // Skip very dark or very light pixels
                        if (r + g + b < 30 || r + g + b > 740) continue;

                        // Create a simple color key
                        const colorKey = `${Math.floor(r / 10)},${Math.floor(g / 10)},${Math.floor(b / 10)}`;

                        // Count occurrences
                        colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
                    }

                    // Find the most common color
                    let maxCount = 0;
                    let dominantColorKey = '';

                    for (const colorKey in colorCounts) {
                        if (colorCounts[colorKey] > maxCount) {
                            maxCount = colorCounts[colorKey];
                            dominantColorKey = colorKey;
                        }
                    }

                    // Convert back to RGB
                    if (dominantColorKey) {
                        const [r, g, b] = dominantColorKey.split(',').map((c) => parseInt(c) * 10);
                        const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
                        setDominantColor(hexColor);
                    } else {
                        setDominantColor(fallbackColor);
                    }

                    setIsLoading(false);
                };

                img.onerror = () => {
                    setError('Failed to load image');
                    setDominantColor(fallbackColor);
                    setIsLoading(false);
                };

                // Start loading the image
                img.src = imageUrl;
            } catch (err) {
                setError('Error extracting color');
                setDominantColor(fallbackColor);
                setIsLoading(false);
            }
        };

        extractColor();
    }, [imageUrl, fallbackColor]);

    return { dominantColor, isLoading, error };
}
