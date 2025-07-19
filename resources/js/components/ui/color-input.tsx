import { Input } from "./input"
import { Label } from "./label"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import ColorSuggestions from "../app/color-suggestions"

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
  const [inputValue, setInputValue] = useState(value.replace("#", ""))

  // Update input value when prop value changes
  useEffect(() => {
    setInputValue(value.replace("#", ""))
  }, [value])

  // Validate and format hex color input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6)
    setInputValue(newValue)
    if (newValue.length === 6) {
      onChange(`#${newValue}`)
    }
  }

  return (
    <div className={cn("space-y-1", className)}>
      {label && <Label>{label}</Label>}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center px-3 border-r pointer-events-none text-gray-500">
            #
          </div>
          <Input
            value={inputValue}
            onChange={handleInputChange}
            className={cn(
              "pl-11",
              error && "border-red-500 focus:border-red-500"
            )}
            maxLength={6}
          />
        </div>
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