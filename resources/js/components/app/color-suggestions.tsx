import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Palette } from 'lucide-react';
import { useState } from 'react';

interface ColorSuggestionsProps {
    onColorSelect: (color: string) => void;
}

export default function ColorSuggestions({ onColorSelect }: ColorSuggestionsProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Predefined color suggestions
    const colorSuggestions = [
        // Blues
        '#1E40AF',
        '#3B82F6',
        '#93C5FD',
        '#DBEAFE',
        // Greens
        '#15803D',
        '#22C55E',
        '#86EFAC',
        '#DCFCE7',
        // Reds
        '#B91C1C',
        '#EF4444',
        '#FCA5A5',
        '#FEE2E2',
        // Yellows
        '#A16207',
        '#EAB308',
        '#FDE047',
        '#FEF9C3',
        // Purples
        '#7E22CE',
        '#A855F7',
        '#D8B4FE',
        '#F3E8FF',
        // Pinks
        '#BE185D',
        '#EC4899',
        '#F9A8D4',
        '#FCE7F3',
        // Oranges
        '#C2410C',
        '#F97316',
        '#FDBA74',
        '#FFF7ED',
        // Teals
        '#0F766E',
        '#14B8A6',
        '#5EEAD4',
        '#CCFBF1',
        // Grays
        '#1F2937',
        '#6B7280',
        '#D1D5DB',
        '#F9FAFB',
    ];

    const handleColorSelect = (color: string) => {
        onColorSelect(color);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="px-3" type="button">
                    <Palette className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Suggested Colors</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-5 gap-2 p-4">
                    {colorSuggestions.map((color) => (
                        <button
                            key={color}
                            className="h-10 w-10 rounded-md border border-gray-200 transition-transform hover:scale-110 focus:ring-2 focus:ring-gray-400 focus:outline-none"
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorSelect(color)}
                            title={color}
                            type="button"
                        />
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
