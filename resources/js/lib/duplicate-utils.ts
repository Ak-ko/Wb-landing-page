import { router } from '@inertiajs/react';

/**
 * Creates a duplicate route name for a given resource
 * @param resourceName - The resource name (e.g., 'business-brand-guidelines')
 * @returns The duplicate route name
 */
export function createDuplicateRouteName(resourceName: string): string {
    return `${resourceName}.duplicate`;
}

/**
 * Creates an edit route function for a given resource
 * @param resourceName - The resource name (e.g., 'business-brand-guidelines')
 * @returns A function that takes an ID and returns the edit route
 */
export function createEditRoute(resourceName: string): (id: number) => string {
    return (id: number) => route(`${resourceName}.edit`, id);
}

/**
 * Refreshes the current page after a successful duplicate operation
 */
export function refreshPageAfterDuplicate(): void {
    router.reload();
}

/**
 * Handles duplicate errors by logging them
 * @param errors - The error object
 */
export function handleDuplicateError(errors: Record<string, string>): void {
    console.error('Duplicate error:', errors);
}

/**
 * Creates a duplicate configuration object for use with the duplicate hook
 * @param resourceName - The resource name (e.g., 'business-brand-guidelines')
 * @param onSuccess - Optional success callback
 * @param onError - Optional error callback
 * @returns Configuration object for duplicate functionality
 */
export function createDuplicateConfig(
    resourceName: string,
    onSuccess?: (duplicatedId: number) => void,
    onError?: (error: Record<string, string>) => void,
) {
    return {
        duplicateRoute: route(createDuplicateRouteName(resourceName)),
        editRoute: createEditRoute(resourceName),
        onSuccess: onSuccess || refreshPageAfterDuplicate,
        onError: onError || handleDuplicateError,
    };
}
