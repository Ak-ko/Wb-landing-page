import { Label } from "./label"
import { cn } from "@/lib/utils"
import ColorSuggestions from "../app/color-suggestions"
import { SimpleHexColorInput } from "./simple-hex-color-input"
import { DefaultColorInput } from "./default-color-input"

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
          <DefaultColorInput
            value={value}
            onChange={onChange}
            id="color-picker"
          />
          <ColorSuggestions onColorSelect={onChange} />
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
} 