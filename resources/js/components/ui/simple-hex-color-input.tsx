import { Input } from "./input"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface SimpleHexColorInputProps {
  value: string // hex value without #
  onChange: (value: string) => void // returns hex value with #
  placeholder?: string
  className?: string
  error?: string
  maxLength?: number
  updateOnChange?: boolean // if true, updates immediately; if false, only when complete
}

export function SimpleHexColorInput({
  value,
  onChange,
  placeholder = "000000",
  className,
  error,
  maxLength = 6,
  updateOnChange = false
}: SimpleHexColorInputProps) {
  const [inputValue, setInputValue] = useState(value.replace("#", ""))

  // Update input value when prop value changes
  useEffect(() => {
    setInputValue(value.replace("#", ""))
  }, [value])

  // Validate and format hex color input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, maxLength)
    setInputValue(newValue)
    
    if (updateOnChange) {
      // Update immediately (for color-management-modal)
      onChange(`#${newValue}`)
    } else {
      // Only update when complete (for color-input)
      if (newValue.length === maxLength) {
        onChange(`#${newValue}`)
      }
    }
  }

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center border-r px-3 text-gray-500">
        #
      </div>
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={cn(
          "pl-11",
          error && "border-red-500 focus:border-red-500",
          className
        )}
        maxLength={maxLength}
      />
    </div>
  )
} 