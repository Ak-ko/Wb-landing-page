import { Label } from "./label"
import { cn } from "@/lib/utils"
import ColorSuggestions from "../app/color-suggestions"
import { SimpleHexColorInput } from "./simple-hex-color-input"

interface ColorInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  className?: string
  error?: string
}

export function ColorInput({
  value,
  onChange,
  label,
  className,
  error
}: ColorInputProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {label && <Label>{label}</Label>}
      <div className="flex items-center gap-2">
        <SimpleHexColorInput
          value={value}
          onChange={onChange}
          error={error}
          updateOnChange={false}
          className="flex-1"
        />
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="sr-only"
              id="color-picker"
            />
            <label
              htmlFor="color-picker"
              className="w-10 h-10 rounded-md border border-gray-200 cursor-pointer flex items-center justify-center transition-transform hover:scale-105"
              style={{ backgroundColor: value }}
            />
          </div>
          <ColorSuggestions onColorSelect={onChange} />
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
} 