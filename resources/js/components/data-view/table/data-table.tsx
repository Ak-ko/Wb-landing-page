'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo } from 'react';
import { SimplePaginationControls } from '../simple-pagination-controls';
import TableNoResult from './table-no-result';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onPaginationChange?: (page: number) => void;
    pageSizes?: number[];
    onSelectChange?: (num: number) => void;
    pagingData?: {
        total: number;
        pageIndex: number;
        pageSize: number;
    };
    className?: string;
    onRowClick?: (row: TData) => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onPaginationChange,
    onSelectChange,
    pageSizes = [5, 10, 25, 50, 100],
    pagingData = {
        total: 0,
        pageIndex: 0,
        pageSize: 10,
    },
    className,
    onRowClick,
}: DataTableProps<TData, TValue>) {
    const { pageSize, pageIndex, total } = pagingData;

    const pageSizeOption = useMemo(
        () =>
            pageSizes.map((number) => ({
                value: number,
                label: `${number}`,
            })),
        [pageSizes],
    );

    const handlePaginationChange = (page: number) => {
        onPaginationChange?.(page);
    };

    const handleSelectChange = (value?: number) => {
        if (value) {
            onSelectChange?.(Number(value));
        }
    };

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: Math.max(1, Math.ceil(total / pageSize)),
        state: {
            pagination: {
                pageIndex,
                pageSize,
            },
        },
    });

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const renderTableRows = () => {
        if (!data.length) {
            return (
                <TableRow>
                    <TableCell colSpan={columns.length} className="h-48 text-center">
                        <TableNoResult />
                    </TableCell>
                </TableRow>
            );
        }

        return table.getRowModel().rows.map((row) => (
            <TableRow
                className="hover:!bg-primary/5 transition-all duration-500 hover:translate-y-[-1px] hover:shadow-lg"
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                onClick={() => onRowClick && onRowClick(row.original)}
            >
                {row.getVisibleCells().map((cell) => (
                    <TableCell className={`py-4 text-center ${onRowClick ? 'cursor-pointer' : ''}`} key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                ))}
            </TableRow>
        ));
    };

    return (
        <div className={className}>
            <div className="border shadow-sm">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        className="bg-primary/90 px-4 py-2 text-center font-bold break-words whitespace-normal text-white"
                                        key={header.id}
                                    >
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>{renderTableRows()}</TableBody>
                </Table>
            </div>

            <div className="mt-4 flex flex-col items-center justify-between gap-4 px-2 py-2 sm:flex-row">
                <div className="text-muted-foreground text-sm">
                    {total} total {total === 1 ? 'row' : 'rows'}
                </div>

                <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <div className="flex items-center gap-3">
                        <p className="text-sm font-medium">Rows per page</p>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                handleSelectChange(Number(e.target.value));
                            }}
                            className="border-input bg-background h-9 w-[70px] rounded-md border px-2"
                        >
                            {pageSizeOption.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <SimplePaginationControls pageIndex={pageIndex} totalPages={totalPages} onPageChange={handlePaginationChange} />
                </div>
            </div>
        </div>
    );
}
