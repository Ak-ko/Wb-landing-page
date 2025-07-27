import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

interface DuplicateButtonProps {
    onClick: () => void;
    title?: string;
    className?: string;
}

export function DuplicateButton({ onClick, title = 'Duplicate', className = '' }: DuplicateButtonProps) {
    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            className={`text-blue-500 hover:bg-blue-50 hover:text-blue-600 ${className}`}
            title={title}
        >
            <Copy className="h-4 w-4" />
        </Button>
    );
}
