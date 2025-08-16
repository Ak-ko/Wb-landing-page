import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ColorInputProps {
    backgroundColor: string;
    textColor: string;
    onBackgroundColorChange: (color: string) => void;
    onTextColorChange: (color: string) => void;
    backgroundColorError?: string;
    textColorError?: string;
    label?: string;
}

export function ColorInput({
    backgroundColor,
    textColor,
    onBackgroundColorChange,
    onTextColorChange,
    backgroundColorError,
    textColorError,
    label = 'Colors',
}: ColorInputProps) {
    return (
        <div className="space-y-4">
            <Label>{label}</Label>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Background Color */}
                <div className="space-y-2">
                    <Label htmlFor="backgroundColor" className="text-sm font-medium">
                        Background Color
                    </Label>
                    <div className="flex items-center gap-2">
                        <Input
                            id="backgroundColor"
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => onBackgroundColorChange(e.target.value)}
                            className="h-10 w-20 p-1"
                        />
                        <Input
                            value={backgroundColor}
                            onChange={(e) => onBackgroundColorChange(e.target.value)}
                            placeholder="#3b82f6"
                            className="flex-1"
                        />
                    </div>
                    {backgroundColorError && <p className="text-sm text-red-500">{backgroundColorError}</p>}
                </div>

                {/* Text Color */}
                <div className="space-y-2">
                    <Label htmlFor="textColor" className="text-sm font-medium">
                        Text Color
                    </Label>
                    <div className="flex items-center gap-2">
                        <Input
                            id="textColor"
                            type="color"
                            value={textColor}
                            onChange={(e) => onTextColorChange(e.target.value)}
                            className="h-10 w-20 p-1"
                        />
                        <Input value={textColor} onChange={(e) => onTextColorChange(e.target.value)} placeholder="#ffffff" className="flex-1" />
                    </div>
                    {textColorError && <p className="text-sm text-red-500">{textColorError}</p>}
                </div>
            </div>

            {/* Preview */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">Preview</Label>
                <Card>
                    <CardContent className="p-4">
                        <div
                            className="inline-block rounded-full px-4 py-2 text-sm font-medium"
                            style={{
                                backgroundColor: backgroundColor,
                                color: textColor,
                            }}
                        >
                            Preview Text
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
