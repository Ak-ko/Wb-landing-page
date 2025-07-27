import { cn } from '@/lib/utils';
import { FormFieldProps } from '@/types/common';

export default function FormField({ label, required = false, error, className = '', children, helperText }: FormFieldProps) {
    return (
        <div className={cn('space-y-2', className)}>
            <label className="block text-sm font-medium">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
            {helperText && <p className="text-sm text-gray-500">{helperText}</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
