import { cn } from "@/lib/utils"

interface DefaultColorInputProps {
  value: string
  onChange: (value: string) => void
  className?: string
  id?: string
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10", 
  lg: "w-12 h-12"
}

export function DefaultColorInput({
  value,
  onChange,
  className,
  id = "color-picker",
  size = "md"
}: DefaultColorInputProps) {
  return (
    <div className="relative">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
        id={id}
      />
      <label
        htmlFor={id}
        className={cn(
          "rounded-md border border-gray-200 cursor-pointer flex items-center justify-center",
          "transition-all duration-200 ease-in-out",
          "hover:scale-110 hover:shadow-md",
          "active:scale-95",
          "focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2",
          sizeClasses[size],
          className
        )}
        style={{ backgroundColor: value }}
        title={`Color: ${value}`}
      />
    </div>
  )
} 