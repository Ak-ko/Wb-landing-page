import { FileX } from 'lucide-react';

export default function TableNoResult() {
    return (
        <div className="flex flex-col items-center justify-center py-10">
            <FileX className="text-muted-foreground/50 h-16 w-16" />
            <h3 className="mt-4 text-lg font-medium">No results found</h3>
            <p className="text-muted-foreground mt-2 text-center text-sm">
                We couldn't find any matching records.
                <br />
                Try adjusting your search or filters.
            </p>
        </div>
    );
}
