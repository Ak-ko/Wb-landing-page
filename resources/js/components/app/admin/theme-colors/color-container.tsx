import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ReactNode } from 'react';

interface Color {
    id: number;
    color: string;
    type: 'white_bg' | 'black_bg';
}

interface ColorContainerProps {
    title: string;
    colors: Color[];
    backgroundType: 'white_bg' | 'black_bg';
    onColorClick?: (color: Color) => void;
    onCreateClick?: () => void;
    showCreateButton?: boolean;
    children?: ReactNode;
}

export default function ColorContainer({
    title,
    colors,
    backgroundType,
    onColorClick,
    onCreateClick,
    showCreateButton = false,
    children,
}: ColorContainerProps) {
    const isWhiteBg = backgroundType === 'white_bg';

    const containerClasses = isWhiteBg ? 'rounded-lg border bg-white p-6 shadow-sm' : 'rounded-lg border bg-gray-900 p-6 shadow-sm';

    const titleClasses = isWhiteBg ? 'text-lg font-semibold text-gray-900' : 'text-lg font-semibold text-gray-100';

    const borderClasses = isWhiteBg ? 'border-gray-200' : 'border-gray-700';

    return (
        <div className={containerClasses}>
            <div className="mb-4 flex items-center justify-between">
                <h2 className={titleClasses}>{title}</h2>
                {showCreateButton && onCreateClick && (
                    <Button onClick={onCreateClick} size="sm" className="gap-2" variant={isWhiteBg ? 'default' : 'secondary'}>
                        <Plus className="h-4 w-4" />
                        Add Color
                    </Button>
                )}
                {children}
            </div>
            <div className="grid grid-cols-5 gap-3">
                {colors.map((color) => (
                    <button
                        key={color.id}
                        className={`h-12 w-12 rounded-md border ${borderClasses} transition-all hover:scale-110 hover:shadow-md focus:ring-2 focus:ring-gray-400 focus:outline-none`}
                        style={{ backgroundColor: color.color }}
                        onClick={() => onColorClick?.(color)}
                        title={`${color.color}${onColorClick ? ' (Click to edit)' : ''}`}
                        type="button"
                    />
                ))}
            </div>
        </div>
    );
}
