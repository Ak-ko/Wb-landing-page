import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { SimplePaginationControls } from '../simple-pagination-controls';

interface DataCardViewProps<TData> {
    data: TData[];
    renderCard: (item: TData) => ReactNode;
    className?: string;
    gridClassName?: string;
    onPaginationChange?: (page: number) => void;
    pageSizes?: number[];
    onSelectChange?: (num: number) => void;
    pagingData?: {
        total: number;
        pageIndex: number;
        pageSize: number;
    };
    emptyState?: ReactNode;
}

export function DataCardView<TData>({
    data,
    renderCard,
    className,
    gridClassName,
    onPaginationChange,
    onSelectChange,
    pageSizes = [5, 10, 25, 50, 100],
    pagingData = {
        total: 0,
        pageIndex: 0,
        pageSize: 10,
    },
    emptyState,
}: DataCardViewProps<TData>) {
    const { pageSize, pageIndex, total } = pagingData;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const handlePaginationChange = (page: number) => {
        onPaginationChange?.(page);
    };

    const handleSelectChange = (value?: number) => {
        if (value) {
            onSelectChange?.(Number(value));
        }
    };

    return (
        <div className={className}>
            {data.length === 0 ? (
                emptyState || (
                    <Card className="p-8 text-center">
                        <CardContent>
                            <p className="text-muted-foreground">No data available</p>
                        </CardContent>
                    </Card>
                )
            ) : (
                <div className={cn('grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3', gridClassName)}>{data.map(renderCard)}</div>
            )}

            {(onPaginationChange || onSelectChange) && (
                <div className="mt-4 flex flex-col items-center justify-between gap-4 px-2 py-2 sm:flex-row">
                    <div className="text-muted-foreground text-sm">
                        {total} total {total === 1 ? 'item' : 'items'}
                    </div>

                    <div className="flex flex-col items-center gap-4 sm:flex-row">
                        {onSelectChange && (
                            <div className="flex items-center gap-3">
                                <p className="text-sm font-medium">Items per page</p>
                                <select
                                    value={pageSize}
                                    onChange={(e) => {
                                        handleSelectChange(Number(e.target.value));
                                    }}
                                    className="border-input bg-background h-9 w-[70px] rounded-md border px-2"
                                >
                                    {pageSizes.map((size) => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <SimplePaginationControls pageIndex={pageIndex} totalPages={totalPages} onPageChange={handlePaginationChange} />
                    </div>
                </div>
            )}
        </div>
    );
}
