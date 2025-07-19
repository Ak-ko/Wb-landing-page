import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { usePage } from '@inertiajs/react';
import { Palette } from 'lucide-react';
import { useState } from 'react';

interface ColorSuggestionsProps {
    onColorSelect: (color: string) => void;
}

interface Color {
    id: number;
    color: string;
    type: 'white_bg' | 'black_bg';
}

interface SharedProps {
    colorSuggestions: {
        white_bg: Color[];
        black_bg: Color[];
    };
    [key: string]: unknown;
}

export default function ColorSuggestions({ onColorSelect }: ColorSuggestionsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { colorSuggestions } = usePage<SharedProps>().props;

    // Get colors from shared data
    const whiteBgColors = colorSuggestions?.white_bg || [];
    const blackBgColors = colorSuggestions?.black_bg || [];

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
            <DialogContent className="border-0 !p-0 outline-0 sm:max-w-[425px]">
                <DialogHeader className="p-5">
                    <DialogTitle>Suggested Colors</DialogTitle>
                </DialogHeader>
                {/* White BG Colors */}
                <div className="mb-4 rounded-lg p-5" style={{ background: '#fff' }}>
                    <div className="mb-5 text-sm font-semibold text-gray-700">For White Background</div>
                    <div className="grid grid-cols-5 gap-2">
                        {whiteBgColors.map((colorItem) => (
                            <button
                                key={colorItem.id}
                                className="h-10 w-10 rounded-md border border-gray-200 transition-transform hover:scale-110 focus:ring-2 focus:ring-gray-400 focus:outline-none"
                                style={{ backgroundColor: colorItem.color }}
                                onClick={() => handleColorSelect(colorItem.color)}
                                title={colorItem.color}
                                type="button"
                            />
                        ))}
                    </div>
                </div>
                {/* Black BG Colors */}
                <div className="rounded-lg rounded-t-none p-5 pb-8" style={{ background: '#111' }}>
                    <div className="mb-5 text-sm font-semibold text-gray-200">For Black Background</div>
                    <div className="grid grid-cols-5 gap-2">
                        {blackBgColors.map((colorItem) => (
                            <button
                                key={colorItem.id}
                                className="h-10 w-10 rounded-md border border-gray-700 transition-transform hover:scale-110 focus:ring-2 focus:ring-gray-400 focus:outline-none"
                                style={{ backgroundColor: colorItem.color }}
                                onClick={() => handleColorSelect(colorItem.color)}
                                title={colorItem.color}
                                type="button"
                            />
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
