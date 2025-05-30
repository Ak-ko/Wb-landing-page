import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Palette } from 'lucide-react';
import { useState } from 'react';

interface ColorSuggestionsProps {
    onColorSelect: (color: string) => void;
}

export default function ColorSuggestions({ onColorSelect }: ColorSuggestionsProps) {
    const [isOpen, setIsOpen] = useState(false);

    const colorSuggestions = [
        '#E53726', // Chillie Red
        '#1274EF', // Crayola Blue
        '#FF1466', // Folly
        '#00B250', // Pigment Green
        '#00A899', // Persian Green
        '#FEC901', // Jonquil
        '#F1621D', // Pantone Orange
        '#8914FF', // Electric Violet
        '#FE7CE5', // Web Violet
        '#780303', // Barn Red
        '#656565', // Dim Gray
        '#F5F5F5', // White Smoke
        '#E53726', // Chillie Red
        '#3E8FF3', // Chefchaouen Blue
        '#0BDA68', // Malachite
        '#0BDCC9', // Turquoise
        '#9E3CFF', // Veronica
        '#A01515', // Penn Red
        '#2E2E2E', // Jet
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
