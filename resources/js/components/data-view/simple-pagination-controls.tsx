import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PaginationControlsProps {
    pageIndex: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export function SimplePaginationControls({ pageIndex, totalPages, onPageChange, className }: PaginationControlsProps) {
    return (
        <div className={`flex items-center gap-1 sm:gap-2 ${className || ''}`}>
            <Button variant="outline" size="icon" onClick={() => onPageChange(pageIndex - 1)} disabled={pageIndex === 1} className="h-8 w-8 sm:flex">
                <ArrowLeft className="h-4 w-4" />
            </Button>

            <div className="flex min-w-[80px] items-center justify-center text-sm">
                <span className="text-muted-foreground">Page</span>
                <span className="mx-1 font-medium">{pageIndex}</span>
                <span className="text-muted-foreground">of {totalPages}</span>
            </div>

            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(pageIndex + 1)}
                disabled={pageIndex >= totalPages}
                className="h-8 w-8 sm:flex"
            >
                <ArrowRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
